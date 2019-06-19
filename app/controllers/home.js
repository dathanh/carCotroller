var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var boundaryID = "BOUNDARY";
var path = require('path');
var PubSub = require("pubsub-js");
var os = require('os');
var fs = require("fs");
var pjson = require('../../package.json');
var tmpFolder = os.tmpdir();
var tmpImage = pjson.name + '-image.jpg';
var chokidar = require('chokidar');
var localIp = require('ip');

exports.home = function(req, res) {

  res.render('index.ejs', {
    title: 'Car Controll',
    ip : localIp.address(),

  });

}
