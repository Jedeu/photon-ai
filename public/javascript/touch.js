// listens for touch events and emit an eventName and touch target to an event bus
// config UX(sensitivity) and pubsub
// currently handles swipe + direction and tap
// NOTE: arrow keys simulate swipe can be enabled, comment it back in
if (!window.Photon) {
  window.Photon = {};
}

Photon.touchEngine = (function(pubsub){

  // config: minimum swipe distance over a given time
  // i.e.: must swipe at least (x || y) pixels under (dur) milliseconds
  var sensitivityX = 30; // pixels
  var sensitivityY = 30; // pixels
  var maxDuration = 1000; // milliseconds, set timeout, can't swipe forever..
  var minDuration = 80;  // milliseconds, below this, it's a tap event
  var safetyDuration = 20; // milliseconds, prevent unintentional touches

  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  document.addEventListener('touchend', handleTouchEnd, false);
  document.addEventListener('keyup', handleArrowKeys, false);

  var xDown;
  var yDown;
  var timeStart;
  var newTouchFlag; // one touch event per touch flag
  var swipe;
  var target; // emits the target HTML element along with eventName

  function handleTouchStart(evt){
    newTouchFlag = true;
    swipe = null;
    target = evt.target;
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
    timeStart = evt.timeStamp;
  }

  function handleTouchEnd(evt){
    var duration = evt.timeStamp - timeStart;
    if (duration > maxDuration || duration < safetyDuration){
      // timeout
      return;
    } else if (duration < minDuration && duration > safetyDuration){
      pubsub.emit('tap', target);
      return;
    }

    switch(swipe){
      case 'left':
        pubsub.emit('leftSwipe', target);
        break;
      case 'right':
        pubsub.emit('rightSwipe', target);
        break;
      case 'up':
        pubsub.emit('upSwipe', target);
        break;
      case 'down':
        pubsub.emit('downSwipe', target);
        break;
    }
  }

  function handleTouchMove(evt){
    // evt.preventDefault(); // on mobile it prevents window scrolling
    if (!newTouchFlag){
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp; // (+)left (-)right
    var yDiff = yDown - yUp; // (+)up (-)down

    if (Math.abs(xDiff) > sensitivityX){
      newTouchFlag = false;
      if (xDiff > 0){
        // left swipe
        swipe = 'left';
      } else {
        // right swipe
        swipe = 'right';
      }
    }
    if (Math.abs(yDiff) > sensitivityY){
      newTouchFlag = false;
      if (yDiff > 0){
        // up swipe
        swipe = 'up';
      } else {
        // down swipe
        swipe = 'down';
      }
    }
  }

  // NOTE: enable this for arrow-key testing of touch on desktop
  function handleArrowKeys(evt){
    var msg = 'arrow triggered, no target';
    switch(evt.keyCode){
      case 37:
        pubsub.emit('leftSwipe', msg);
        break;
      case 39:
        pubsub.emit('rightSwipe', msg);
        break;
      case 38:
        pubsub.emit('upSwipe', msg);
        break;
      case 40:
        pubsub.emit('downSwipe', msg);
        break;
    }
  }
  // API
  return {
    POST: 'status: touch engine is loaded'
  };
}(Photon.eventBus));
