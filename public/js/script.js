var socket ="";
var currentDeg = 0;
$(document).ready(function() {
var ipAddress= $('#ipAddress').val();
socket = io('http://'+ipAddress+':8080');
socket.on('video', function(data) {
  $('.wraper').css({backgroundImage:'url("'+data.imageConvert+'")'});

});
  document.onkeydown = function(e) {
    e = e || window.event;
    switch (e.keyCode) {
      case 37:
        var ketPress = 'left';
        console.log('Left key pressed');
        break;
      case 38:
        var ketPress = 'up';
        console.log('Up key pressed');
        break;
      case 39:
        var ketPress = 'right';
        console.log('Right key pressed');
        break;
      case 40:
        var ketPress = 'down';
        console.log('Down key pressed');
        break;
      case 65: //A
        currentDeg -= 20;
	if(currentDeg<=0){
	 currentDeg=0;
	}
        console.log(currentDeg);
        console.log('A key pressed');
        var ketPress = 'rotate right';
        $('.line').css({
          'transform': 'rotate(' + currentDeg + 'deg)'
        });
        break;
      case 83: //S
        currentDeg += 20;
	if(currentDeg >=180){
	 currentDeg= 180;
	}
        console.log(currentDeg);
        console.log('S key pressed');
        var ketPress = 'rotate left';
        $('.line').css({
          'transform': 'rotate(' + currentDeg + 'deg)'
        });
        break;
      default:
        var ketPress = 'unknown keypress';
        console.log(e.keyCode);
        break;
    }
     e.preventDefault(); // prevent the default action (scroll / move caret)
    socket.emit('keypress', {
      'keypress': ketPress,
    });
  };
});

function buttonArrow(kepCode) {
  switch (kepCode) {
    case 37:
      var ketPress = 'left';
      console.log('Left key pressed');
      break;
    case 38:
      var ketPress = 'up';
      console.log('Up key pressed');
      break;
    case 39:
      var ketPress = 'right';
      console.log('Right key pressed');
      break;
    case 40:
      var ketPress = 'down';
      console.log('Down key pressed');
      break;
    case 65: //A
      currentDeg -= 20;
	if(currentDeg<=0){
	 currentDeg=0;
	}
      console.log(currentDeg);
      console.log('A key pressed');
      var ketPress = 'rotate left';
      $('.line').css({
        'transform': 'rotate(' + currentDeg + 'deg)'
      });
      break;
    case 83: //S
      currentDeg += 20;
   if(currentDeg >=180){
	 currentDeg= 180;
	}
      console.log(currentDeg);
      console.log('S key pressed');
      var ketPress = 'rotate right';
      $('.line').css({
        'transform': 'rotate(' + currentDeg + 'deg)'
      });
      break;
    default:
      var ketPress = 'unknown keypress';
      console.log(e.keyCode);
      break;
  }
  socket.emit('keypress', {
    'keypress': ketPress,
  });
}
