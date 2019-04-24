var home = require('../app/controllers/home');
var boundaryID = "BOUNDARY";
var path = require('path');
var PubSub = require("pubsub-js");
var os = require('os');
var fs = require("fs");
var pjson = require('../package.json');
var tmpFolder = os.tmpdir();
var tmpImage = pjson.name + '-image.jpg';
var chokidar = require('chokidar');
//you can include all your controllers

module.exports = function(app, passport) {
  app.get('/', home.home); //home
  app.get('/home', home.home); //home

}

var tmpFile = path.resolve(path.join(tmpFolder, tmpImage));
