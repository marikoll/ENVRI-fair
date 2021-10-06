// This is the top level app
// Config
const port = 3000;

// 
var fs     = require('fs');
var parser = require("xml2json");
var express = require("express");

// In practice this would connect to a database.
// e.g. MongoDB that stores JSON
// Here we just read an XML file and parse it to JSON.
let filename = __dirname+'/eml_aegean_plychaetes.xml';
console.log(filename);
const xmlData = fs.readFileSync(filename);
// Parse to JSON object
var jsonObj=JSON.parse(parser.toJson(xmlData));
// console.dir(jsonObj);

var authorJson=jsonObj["eml:eml"]["dataset"]["creator"]["individualName"];
var authorPlaintext=authorJson["givenName"] + " " + authorJson["surName"];
console.log(authorJson);
console.log(authorPlaintext);

// The web request handler
// var app = new express();
// app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
