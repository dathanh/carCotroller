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
var pin23 = new Gpio(23,'out');
var pin24 =new Gpio(24,'out')
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
		stop();
	}
  });

});

function turnLeft(){
  pin23.writeSync(1);
  pin24.writeSync(0);
}
function turnRight(){
  pin23.writeSync(0);
  pin24.writeSync(1);
}
function stop(){
  pin23.writeSync(0);
  pin24.writeSync(0);
}


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
