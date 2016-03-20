
// Global vars:
  // $: jquery
  // eventBus: on('event', callback); emit('event', data); listEvents();
  // imgHelper: render(); multiRender(); genURL(x, y);

// eventBus events:
  // touch.js emits a swipe event and swipe html target ('leftSwipe', <p>oeu</p>)


// myApp main
var myApp = (function() {

  function placehold (){
    console.log('this is a private placeholder template!');
  }

  function initialise (){
    console.log('myApp is initialised');
  }
  
  // API
  return {
    init: initialise
  };

}());
