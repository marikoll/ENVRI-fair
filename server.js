// This is the top level app
// Config
const port = 3000;

// Load installed modules (npm install). Q: difference between const and var?
var fs     = require('fs');
var xmlParser = require("xml2json");
var express = require("express");
var helmet = require('helmet')

// In practice this would connect to a database.
// e.g. MongoDB that stores JSON
// Here we just read an XML file and parse it to JSON.
let filename = __dirname+'/eml_aegean_plychaetes.xml';
console.log("Parsing " + filename);
const xmlData = fs.readFileSync(filename);
// Parse to JSON object
var jsonObj=JSON.parse(xmlParser.toJson(xmlData));


// Set up a webapp. Q new needed or not?
var app = new express();

app.use(helmet())



// Set up routes
// author name
app.get('/api/v1/:datasetId/author', function(req,res){
    // TODO add search for datasetId  in req.params["datasetId"]
    res.format({
        text: () => {
            // res.send(encodeURI(jsonObj["eml:eml"]["dataset"]["creator"]["individualName"]["givenName"] + " " +
            res.send(jsonObj["eml:eml"]["dataset"]["creator"]["individualName"]["givenName"] + " " +
            jsonObj["eml:eml"]["dataset"]["creator"]["individualName"]["surName"]);
        },
        json: () => {
            res.send(JSON.stringify(jsonObj["eml:eml"]["dataset"]["creator"]["individualName"]));
        }
    });
});

// Time
app.get('/api/v1/:datasetId/time', function(req,res){
    res.format({
        text: () => {
            // res.send(encodeURI("You asked for dataset id " + req.params["datasetId"] +". Time is 0000-00-00"));
            res.send("You asked for dataset id " + req.params["datasetId"] +". Time is 0000-00-00");
        },
        json: () => {
            res.send(JSON.stringify({ "datasetId": req.params["datasetId"] , "date": "0000-00-00" }));
        }
    });
});

// Start the app on port
app.listen(port, () => console.log(`FAIR app listening on port ${port}!`));
