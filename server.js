// This is the top level app
// Config
const port = 3000;

// 
var fs     = require('fs');
var xmlParser = require("xml2json");
var express = require("express");

// In practice this would connect to a database.
// e.g. MongoDB that stores JSON
// Here we just read an XML file and parse it to JSON.
let filename = __dirname+'/eml_aegean_plychaetes.xml';
console.log(filename);
const xmlData = fs.readFileSync(filename);
// Parse to JSON object
var jsonObj=JSON.parse(xmlParser.toJson(xmlData));


// The web request handler
var app = new express();

// 
app.get('/api/v1/:datasetId/author', function(req,res){
    res.format({
        text: () => {
            res.send(jsonObj["eml:eml"]["dataset"]["creator"]["individualName"]["givenName"] + " " +
            jsonObj["eml:eml"]["dataset"]["creator"]["individualName"]["surName"]);
        },
        json: () => {
            res.send(jsonObj["eml:eml"]["dataset"]["creator"]["individualName"]);
        }
    });
});

// just an example
app.get('/api/v1/:datasetId/time', function(req,res){
    res.format({
        text: () => {
            res.send("You asked for dataset id " + req.params["datasetId"] +". Time is 0000-00-00");
        },
        json: () => {
            res.send({ "datasetId": req.params["datasetId"] , "date": "0000-00-00" });
        }
    });
});


app.listen(port, () => console.log(`FAIR app listening on port ${port}!`));
