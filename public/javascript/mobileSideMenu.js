// NOTE hard-codedd to the <aside> element
// much WIP, very incomplete, wow

(function(){
  document.addEventListener("DOMContentLoaded", cacheDOM);

  var $aside;
  function cacheDOM(){
      $aside = $('aside');
  }

  function hide(){
    $aside.hide();
  }

  function show(){
    $aside.show();
  }

  // interaction
  eventBus.on('leftSwipe', show);
  eventBus.on('rightSwipe', hide);

}());
