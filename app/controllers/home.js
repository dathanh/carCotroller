var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var boundaryID = "BOUNDARY";
var os = require('os');
var fs = require("fs");
var pjson = require('./package.json');
var tmpFolder = os.tmpdir();
var tmpImage = pjson.name + '-image.jpg';
var chokidar = require('chokidar');

exports.home = function(req, res) {
  if (req.url.match(/^\/.+\.jpg$/)) {

      res.writeHead(200, {
          'Content-Type': 'multipart/x-mixed-replace;boundary="' + boundaryID + '"',
          'Connection': 'keep-alive',
          'Expires': 'Fri, 27 May 1977 00:00:00 GMT',
          'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
          'Pragma': 'no-cache'
      });

      //
      // send new frame to client
      //
      var subscriber_token = PubSub.subscribe('MJPEG', function(msg, data) {

          //console.log('sending image');

          res.write('--' + boundaryID + '\r\n')
          res.write('Content-Type: image/jpeg\r\n');
          res.write('Content-Length: ' + data.length + '\r\n');
          res.write("\r\n");
          res.write(Buffer(data), 'binary');
          res.write("\r\n");
      });

      //
      // connection is closed when the browser terminates the request
      //
      res.on('close', function() {
          console.log("Connection closed!");
          PubSub.unsubscribe(subscriber_token);
          res.end();
      });
}

  res.render('index.ejs', {
    error: req.flash("error"),
    success: req.flash("success"),
    session: req.session,
    title: 'Car Controll',

  });

}

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
            PubSub.publish('MJPEG', imageData);
        }
        else {
            console.log(err);
        }
    });
});
