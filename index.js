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

app.get('/data/author', function(req,res){
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


app.listen(port, () => console.log(`FAIR app listening on port ${port}!`));
