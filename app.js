var express = require('express');
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('thanh.key');
var certificate = fs.readFileSync('thanh.cert');
var credentials = {'key': privateKey, 'cert': certificate};
var app = express();
var server = require('http').Server(app);
var httpsServer = https.Server(credentials, app);
var Gpio =require('onoff').Gpio;
var pin6 = new Gpio(6,'out');
var pin13 =new Gpio(13,'out');
var pin19 =new Gpio(19,'out')
var pin26 =new Gpio(26,'out')
var io = require('socket.io')(server);

var multer = require('multer')
var constants = require('constants');
var constant = require('./config/constants');


var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var now = new Date();

var os = require('os'),
    http = require("http"),
    util = require("util"),
    chokidar = require('chokidar'),
    PubSub = require("pubsub-js"),
    localIp = require('ip'),
    PiCamera = require('./camera.js'),
    program = require('commander'),
    pjson = require('./package.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


/***************Mongodb configuratrion********************/
var mongoose = require('mongoose');
// var configDB = require('./config/database.js');
//configuration ===============================================================
// mongoose.connect(configDB.url); // connect to our database


require('./config/passport')(passport); // pass passport for configuration

//set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms

//view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
//app.set('view engine', 'ejs'); // set up ejs for templating


//required for passport
//app.use(session({ secret: 'iloveyoudear...' })); // session secret

app.use(session({
  secret: 'I Love India...',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./config/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


//launch ======================================================================
server.listen(port);
httpsServer.listen(8443);


program
  .version(pjson.version)
  .description(pjson.description)
  .option('-p --port <n>', 'port number (default 8080)', parseInt)
  .option('-w --width <n>', 'image width (default 640)', parseInt)
  .option('-l --height <n>', 'image height (default 480)', parseInt)
  .option('-q --quality <n>', 'jpeg image quality from 0 to 100 (default 85)', parseInt)
  .option('-s --sharpness <n>', 'Set image sharpness (-100 - 100)', parseInt)
  .option('-c --contrast <n>', 'Set image contrast (-100 - 100)', parseInt)
  .option('-b --brightness <n>', 'Set image brightness (0 - 100) 0 is black, 100 is white', parseInt)
  .option('-s --saturation <n>', 'Set image saturation (-100 - 100)', parseInt)
  .option('-t --timeout <n>', 'timeout in milliseconds between frames (default 500)', parseInt)
  .option('-v --version', 'show version')
  .parse(process.argv);

program.on('--help', function(){
  console.log("Usage: " + pjson.name + " [OPTION]\n");
});

var width = program.width || 640,
    height = program.height || 480,
    timeout = program.timeout || 250,
    quality = program.quality || 75,
    sharpness = program.sharpness || 0,
    contrast = program.contrast || 0,
    brightness = program.brightness || 50,
    saturation = program.saturation || 0,
    tmpFolder = os.tmpdir(),
    tmpImage = pjson.name + '-image.jpg',
    localIpAddress = localIp.address(),
    boundaryID = "BOUNDARY";


io.on('connection', function(socket) {
  console.log('Có người kết nối ' + socket.id);

  socket.on('keypress', function(data) {
    console.log('Người kết nối ' + socket.id + ' nhấn nút '+ data.keypress);
    switch(data.keypress){
	case 'left':
		turnLeft();
		break;
	case 'right':
		turnRight();
		break;
	case 'up' :
		goHead();
		break;
	case 'down' :
		goBack();
		break;
	}
  });
  var tmpFile = path.resolve(path.join(tmpFolder, tmpImage));

  // start watching the temp image for changes
  var watcher = chokidar.watch(tmpFile, {
    persistent: true,
    usePolling: true,
    interval: 10,
  });

  // hook file change events and send the modified image to the browser
  watcher.on('change', function(file) {

      //console.log('change >>> ', file);

      fs.readFile(file, function(err, imageData) {
          if (!err) {
            var imageConvert ='data:image/jpeg;base64,'+ imageData.toString('base64');
            socket.emit('video', {
              'imageConvert': imageConvert,
            });
          }
          else {
              console.log(err);
          }
      });
  });

});

function goHead(){
  pin6.writeSync(1);
  pin13.writeSync(0);
  pin19.writeSync(0);
  pin26.writeSync(1);
  setTimeout(function(){
	stop();
  },100);
}
function turnLeft(){
  pin6.writeSync(1);
  pin13.writeSync(0);
  pin19.writeSync(1);
  pin26.writeSync(0);
  setTimeout(function(){
	stop();
  },100);
}
function turnRight(){
  pin6.writeSync(0);
  pin13.writeSync(1);
  pin19.writeSync(0);
  pin26.writeSync(1);
  setTimeout(function(){
	stop();
  },100);
}
function goBack(){
  pin6.writeSync(0);
  pin13.writeSync(1);
  pin19.writeSync(1);
  pin26.writeSync(0);
  setTimeout(function(){
	stop();
  },50);
}
function stop(){
  pin6.writeSync(0);
  pin13.writeSync(0);
  pin19.writeSync(0);
  pin26.writeSync(0);
}


// setup the camera
var camera = new PiCamera();

// start image capture
camera
    .nopreview()
    .baseFolder(tmpFolder)
    .thumb('0:0:0') // dont include thumbnail version
    .timeout(9999999) // never end
    .timelapse(timeout) // how often we should capture an image
    .width(width)
    .height(height)
    .quality(quality)
    .sharpness(sharpness)
    .contrast(contrast)
    .brightness(brightness)
    .saturation(saturation)
.takePicture(tmpImage);


console.log('The magic happens on port ' + port);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).render('404', {
    title: "Sorry, page not found",
    session: req.sessionbo
  });
});

app.use(function(req, res, next) {
  res.status(500).render('404', {
    title: "Sorry, page not found"
  });
});
exports = module.exports = app;
