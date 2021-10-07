// This is the top level app
// Config
const port = 3000;

// Load installed modules (npm install). Q: difference between const and var?
var fs     = require('fs');
var xmlParser = require("xml2json");
var express = require("express");

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



// Set up routes
// author name
app.get('/api/v1/:datasetId/author', function(req,res){
    // TODO add search for datasetId  in req.params["datasetId"]
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

// Time
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

// Security test route
app.get('/api/v1/:datasetId/testing', function(req,res){
    res.format({
        text: () => {
            res.send("http://bad.guy.somewhere/format_client_disk.html");
        },
        html: () => {
            res.send("<p>You asked for this</p><a href=\"http://do.bad.stuff/empty_my_account_script.html\">Good luck</a></p>");
        }
    });
});

// Start the app on port
app.listen(port, () => console.log(`FAIR app listening on port ${port}!`));
