// This is the top level app
// Config
const port = 3000;
//
// Import and format logger
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'api-v1' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logfile.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

winston.add(logger);

// Load installed modules (npm install). Q: difference between const and var?
const fs     = require('fs');
const xmlParser = require("xml2json");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');

// In practice this would connect to a database.
// e.g. MongoDB that stores JSON
// Here we just read an XML file and parse it to JSON.
var filename = __dirname+'/eml_aegean_plychaetes.xml';
logger.log('info', "Parsing " + filename);
const xmlData = fs.readFileSync(filename);
// Parse to JSON object
const jsonObj=JSON.parse(xmlParser.toJson(xmlData));


// Set up a webapp. Q new needed or not?
var app = new express();

// Apply default http headers for improved security
app.use(helmet());

// Limit requests
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //limit per 10 min
    max: 100
});
app.use(limiter);


// Set up routes for GET requests
// Get Author name
app.get('/api/v1/:datasetId/author', function(req,res){
    // TODO add search for datasetId  in req.params["datasetId"]
    // Allow content negotiation for text/plain and application/json
    res.format({
        text: () => {
            res.send(jsonObj["eml:eml"]["dataset"]["creator"]["individualName"]["givenName"] + " " +
            jsonObj["eml:eml"]["dataset"]["creator"]["individualName"]["surName"]);
        },
        json: () => {
            res.send(JSON.stringify(jsonObj["eml:eml"]["dataset"]["creator"]["individualName"]));
        }
    });
});

// Get Time
app.get('/api/v1/:datasetId/time', function(req,res){
    res.format({
        text: () => {
	    var begin = jsonObj["eml:eml"]["dataset"]["coverage"]["temporalCoverage"]["rangeOfDates"]["beginDate"]["calendarDate"];
	    var end = jsonObj["eml:eml"]["dataset"]["coverage"]["temporalCoverage"]["rangeOfDates"]["endDate"]["calendarDate"];
            res.send(`Time span of dataset: Begin ${begin}, End ${end}`);
        },
        json: () => {
            res.send(JSON.stringify(jsonObj["eml:eml"]["dataset"]["coverage"]["temporalCoverage"]["rangeOfDates"]) );
        }
    });
});

// Get License
app.get('/api/v1/:datasetId/license', function(req,res){
    res.format({
        text: () => {
	    licUrl = encodeURI(jsonObj["eml:eml"]["dataset"]["intellectualRights"]["para"]["ulink"]["url"]);
	    licName = jsonObj["eml:eml"]["dataset"]["intellectualRights"]["para"]["ulink"]["citetitle"];
	    res.send(`The license of this dataset is ${licName}, ${licUrl}`);
        },
        json: () => {
            res.send(JSON.stringify(jsonObj["eml:eml"]["dataset"]["intellectualRights"]) );
        }
    });
});

// include html page
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('server.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
});

// Start the app listening on defined port
app.listen(port, () => logger.log('info', "API running  on port ${port}!"));
