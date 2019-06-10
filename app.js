var express = require("express");
var fs = require("fs");
var https = require("https");
var app = express();
var server = require("http").Server(app);
var httpsServer = https.Server(credentials, app);
var Gpio = require("onoff").Gpio;
var pin6 = new Gpio(6, "out");
var pin13 = new Gpio(13, "out");
var pin19 = new Gpio(19, "out");
var pin26 = new Gpio(26, "out");

const gpioPWM = require("pigpio").Gpio;
const pin10PWM = new gpioPWM(18, { mode: gpioPWM.OUTPUT });
let pulseWidth = 1000;
let increment = 100;
var io = require("socket.io")(server);

var multer = require("multer");
var constants = require("constants");
var constant = require("./config/constants");

var port = process.env.PORT || 8080;
var path = require("path");

var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var bodyParser = require("body-parser");
var dateFormat = require("dateformat");
var now = new Date();

var os = require("os"),
  http = require("http"),
  util = require("util"),
  chokidar = require("chokidar"),
  PubSub = require("pubsub-js"),
  localIp = require("ip"),
  PiCamera = require("./camera.js"),
  program = require("commander"),
  pjson = require("./package.json");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//view engine setup
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "app/views"));
app.set("view engine", "ejs");

// routes ======================================================================
require("./config/routes.js")(app, passport); // load our routes and pass in our app and fully configured passport

//launch ======================================================================
server.listen(port);

var width = program.width || 640,
  height = program.height || 480,
  timeout = program.timeout || 250,
  quality = program.quality || 75,
  sharpness = program.sharpness || 0,
  contrast = program.contrast || 0,
  brightness = program.brightness || 50,
  saturation = program.saturation || 0,
  tmpFolder = os.tmpdir(),
  tmpImage = pjson.name + "-image.jpg",
  localIpAddress = localIp.address(),
  boundaryID = "BOUNDARY";

io.on("connection", function(socket) {
  console.log("Có người kết nối " + socket.id);

  socket.on("keypress", function(data) {
    console.log("Người kết nối " + socket.id + " nhấn nút " + data.keypress);
    switch (data.keypress) {
      case "left":
        turnLeft();
        break;
      case "right":
        turnRight();
        break;
      case "up":
        goHead();
        break;
      case "down":
        goBack();
        break;
      case "rotate left":
        rotateLeft();
        break;
      case "rotate right":
        rotateRight();
        break;
    }
  });

function goHead() {
  pin6.writeSync(1);
  pin13.writeSync(0);
  pin19.writeSync(0);
  pin26.writeSync(1);
  setTimeout(function() {
    stop();
  }, 100);
}
function turnLeft() {
  pin6.writeSync(1);
  pin13.writeSync(0);
  pin19.writeSync(1);
  pin26.writeSync(0);
  setTimeout(function() {
    stop();
  }, 100);
}
function turnRight() {
  pin6.writeSync(0);
  pin13.writeSync(1);
  pin19.writeSync(0);
  pin26.writeSync(1);
  setTimeout(function() {
    stop();
  }, 100);
}
function goBack() {
  pin6.writeSync(0);
  pin13.writeSync(1);
  pin19.writeSync(1);
  pin26.writeSync(0);
  setTimeout(function() {
    stop();
  }, 50);
}
function stop() {
  pin6.writeSync(0);
  pin13.writeSync(0);
  pin19.writeSync(0);
  pin26.writeSync(0);
}
function rotateLeft() {
  pulseWidth += increment;
  if (pulseWidth >= 2400) {
    pulseWidth = 2400;
  }
  pin10PWM.servoWrite(pulseWidth);
}
function rotateRight() {
  pulseWidth -= increment;
  if (pulseWidth <= 500) {
    pulseWidth = 500;
  }
  pin10PWM.servoWrite(pulseWidth);
}

function testPWM() {
  setInterval(() => {
    pin10PWM.servoWrite(pulseWidth);
    console.log(pin10PWM.getServoPulseWidth());

    pulseWidth += increment;
    if (pulseWidth >= 2000) {
      increment = -100;
    } else if (pulseWidth <= 1000) {
      increment = 100;
    }
  }, 1000);
}



console.log("The magic happens on port " + port);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).render("404", {
    title: "Sorry, page not found",
    session: req.sessionbo
  });
});

app.use(function(req, res, next) {
  res.status(500).render("404", {
    title: "Sorry, page not found"
  });
});
exports = module.exports = app;
