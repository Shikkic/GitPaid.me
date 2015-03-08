var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

var morgan = require('morgan');

var configDB = require('./config/database.js');

var options= {
    key: fs.readFileSync('./keys/key.pem'),
    cert: fs.readFileSync('./keys/ca.crt')
};

MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {

//Middleware
app.use(morgan('dev'));

//require our batch-updates
//require('./app/batch.js')(app,request,db);

//require our routes
require('./app/routes.js')(app,request,db);

//create our http server
http.createServer(app).listen(80, function(){
    console.log("Serv is listening on port 80");
});

//Create our https server
https.createServer(options, app, function(req, res){
    console.log("https");
    res.writeHead(200);
    res.end("Hello world\n");
    }).listen(443, function(){
        console.log("Serv is listening");
    });


});

