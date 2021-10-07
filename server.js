// This is the top level app
// Config
const port = 3000;

// Load installed modules (npm install). Q: difference between const and var?
const fs     = require('fs');
const xmlParser = require("xml2json");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require('helmet')

// In practice this would connect to a database.
// e.g. MongoDB that stores JSON
// Here we just read an XML file and parse it to JSON.
var filename = __dirname+'/eml_aegean_plychaetes.xml';
console.log("Parsing " + filename);
const xmlData = fs.readFileSync(filename);
// Parse to JSON object
const jsonObj=JSON.parse(xmlParser.toJson(xmlData));


// Set up a webapp. Q new needed or not?
var app = new express();

// Apply default http headers for improved security
app.use(helmet())

// Limit requests
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //limit per 10 min
    max: 100
})
app.use(limiter)


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
	    var begin = jsonObj["eml:eml"]["dataset"]["coverage"]["temporalCoverage"]["rangeOfDates"]["beginDate"]["calendarDate"]
	    var end = jsonObj["eml:eml"]["dataset"]["coverage"]["temporalCoverage"]["rangeOfDates"]["endDate"]["calendarDate"]
            res.send(`Time span of dataset: Begin ${begin}, End ${end}`);
        },
        json: () => {
            res.send(JSON.stringify(jsonObj["eml:eml"]["dataset"]["coverage"]["temporalCoverage"]["rangeOfDates"]) );
        }
    });
});


// Start the app listening on defined port
app.listen(port, () => console.log(`API running  on port ${port}!`));
