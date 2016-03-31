// this is a publish-subscribe pattern, accessible globally
// subscribe: eventBus.on('eventName', callback);
// emit: eventBus.emit('eventName', data);
// helper: if there are no listeners to that event, it will console.log
// NOTE: load this one first in html

// current emitters (manually keeping track, may not be accurate)
  // 'leftSwipe' + variants
  // 'imagesRequested', 'append' or 'prepend'
  // 'tap'
  // 'renderImgsToPage', photoObject (.photos, .direction)
  // 'userLoggedIn', null
  // 'noUserLoggedIn', null
  // 'userPhotosFetched', qty
  // 'recPhotosFetched', qty
  // 'searchRequested', string
  // 'nukePhotosFromView', ('all', or array of photo URLs to delete)
  // 'allPhotosNuked', true
  // 'somePhotosNuked', qty
  // 'recBtnClicked', $btn
  // 'recRegistered', $btn
  // 'unlikeBtnClicked', $btn

if (!window.Photon) {
  window.Photon = {};
}
Photon.eventBus = (function(){
  var bus = {};

  function emit(eventName, data){
    if (bus[eventName]){
      bus[eventName].forEach(function(subCallback){
        subCallback(data);
      });
    } else {
      // NOTE this is a helper for debugging, not needed for production
      console.log('eventBus:', eventName, 'has no subscribers (doesn\'t exist in bus)');
    }
  }

  function on(eventName, callback){
    bus[eventName] = bus[eventName] || [];
    bus[eventName].push(callback);
  }

  // helper for debugging
  function listSubscribers(){
    console.log(bus);
  }

  // API
  return {
    POST: 'status: eventBus is loaded',
    listSubscribers: listSubscribers,
    emit: emit,
    on: on
  };
}());
