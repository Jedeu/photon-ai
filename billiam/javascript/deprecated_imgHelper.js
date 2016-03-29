// get a random placeholder image url: genURL(); default can be configured
// get a specific image size: genURL(x, y);
// attach an image to DOM: render($target); render($target, x, y);
// attach multiple images to DOM: multiRender($target, howManyTimes); default 12 times

var imgHelper = (function() {

  // config
  var sourceURL = 'http://placehold.it/';
  var max = 1440;
  var min = 480;

  // helper
  function randAxis(x){
    if (typeof x === 'number'){
      return Math.floor(Math.random() * (x - min + 1)) + x;
    } else {
      return Math.floor(Math.random() * (max - min + 1)) + max;
    }
  }
  function genURL(x, y){
    if (typeof x === 'number' && typeof y === 'number'){
      return sourceURL + x + 'x' + y;
    } else {
      return sourceURL + randAxis() + 'x' + randAxis();
    }
  }

  function genLongEdgeURL(x, y){
    if (typeof x === 'number' && typeof y === 'number'){
      return sourceURL + randAxis(x) + 'x' + randAxis(y);
    } else {
      console.log('genLongEdgeURL(x,y) needs the longest edge and a minimum edge');
      return sourceURL + randAxis() + 'x' + randAxis();
    }
  }

  // UI
  function render($target, x, y) {
    if (!$target){
      console.log('no target provided to render($target, x, y)');
      return;
    }
    var imgTag;
    if (typeof x == 'number' && typeof y == 'number'){
      imgTag = $('<img>').attr('src', genURL(x, y));
    } else {
      imgTag = $('<img>').attr('src', genURL());
    }
    $target.append(imgTag);
  }
  function multiRender($target, times){
    if (!$target){
      console.log('no target provided to render($target, x, y)');
      return;
    }
    var standard = times ? times : 12;
    for (var i = 0; i < standard; i++){
      render($target);
    }
  }

  // API
  return {
    render: render,
    multiRender: multiRender,
    genURL: genURL,
    genLongEdgeURL: genLongEdgeURL
  };
}());
