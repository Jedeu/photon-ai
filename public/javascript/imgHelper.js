// NOTE auto-render currently hardwired to the .images class
// get a random placeholder image url: genURL(); default can be configured
// get a specific image size: genURL(x, y);
// attach an image to DOM: render();
// attach multiple images to DOM: multiRender(howManyTimes); default 12 times

var imgHelper = (function() {

  document.addEventListener("DOMContentLoaded", cacheDOM);

  // config
  var sourceURL = 'http://placehold.it/';
  var max = 1440;
  var min = 480;

  // cache DOM
  var $imgDiv;
  function cacheDOM (){
    $imgDiv = $('.images');
  }

  // helper
  function randAxis(){
    return Math.floor(Math.random() * (max - min + 1)) + max;
  }
  function genURL(x, y){
    if (typeof x === 'number' && typeof y === 'number'){
      return sourceURL + x + 'x' + y;
    } else {
      return sourceURL + randAxis() + 'x' + randAxis();
    }
  }

  // UI
  function render() {
    var imgTag = $('<img>').attr('src', genURL());
    $imgDiv.append(imgTag);
  }
  function multiRender(times){
    var standard = times ? times : 12;
    for (var i = 0; i < standard; i++){
      render();
    }
  }

  // API
  return {
    render: render,
    multiRender: multiRender,
    genURL: genURL
  };
}());
