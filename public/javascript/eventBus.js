// this is a publish-subscribe pattern, accessible globally
// subscribe: eventBus.on('eventName', callback);
// emit: eventBus.emit('eventName', data);
// helper: if there are no listeners to that event, it will console.log

var eventBus = (function(){
  var bus = {};

  function emit(eventName, data){
    if (bus[eventName]){
      bus[eventName].forEach(function(subCallback){
        subCallback(data);
      });
    } else {
      // NOTE this is a helper for debugging, not needed for production
      console.log('pubsub:', eventName, 'has no subscribers (doesn\'t exist in bus)');
    }
  }

  function on(eventName, callback){
    bus[eventName] = bus[eventName] || [];
    bus[eventName].push(callback);
  }

  // helper for debugging
  function listEvents(){
    console.log(bus);
  }

  var API = {
    listEvents: listEvents,
    emit: emit,
    on: on
  };
  return API;
}());
