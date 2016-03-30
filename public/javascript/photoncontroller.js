
// Global vars:
  // $: jquery
  // eventBus
    // subscribe: eventBus.on('eventName', callback);
    // emit: eventBus.emit('eventName', data);
    // helper: if there are no listeners to that event, it will console.log
  // (touch.js) IIFE
    // emits: ('tap', target), ('upSwipe', target) <- all directions
    // on desktop direction keys ard bound to swipe dirs, but no target data
  // $.Nested
    // some .prototype 'APIs'
    // .append(nestBoxes);
    // .prepend(nestBoxes);
    // .resize(nestBoxes);
    // .refresh(options);
    // .destroy();
    // example: $nestContainer.nested('refresh', {options object});
// PhotonUser constructor
// PhotonPhoto constructor
// PhotonView constructor
// document.cookie 4KB
// sessionStorage (scoped to current window tab) 5MB
// localStorage (scoped domain, persistent)
  // setItem('key', 'value'), getItem('key'), removeItem('key') // also localStorage.key



// photon main IIFE with API
// requires modules to be initialised first (html loading order matters)
Photon.Controller = (function(pubsub, view, User, Photo) {

  //////////////////////////////////////////////////////////
  // config important variables
  var serverURL = '/';
  var photoQtyPerRender = 12;
  var currentUser = null;
  // EVENT LISTENERS ///////////////////////////////////////

  //////////////////////////////////////////////////////////
  // from view (API via pubsub)
  pubsub.on('photosRequested', function(direction){
    var somePhotos = getPhotosFrom(currentUser, photoQtyPerRender);
    sendPhotosToView(somePhotos, direction);
  });
  pubsub.on('recPhotosRequested', function(direction){
    var someRecPhotos = getRecPhotosFrom(currentUser, photoQtyPerRender);
    sendPhotosToView(someRecPhotos, direction);
  });

  pubsub.on('userLoggedIn', function(){
    currentUser = new User();
    fetchPhotosFor(currentUser);
  });

  pubsub.on('noUserLoggedIn', function(){
    fetchShowTopPhotos();
  });

  pubsub.on('searchRequested', function(query){
    var queryArr = sanitise(query);
    var foundPhotos = tagSearch(queryArr);
    pubsub.emit('nukePhotosFromView', 'all');
    for (var key in photoStates){
      photoStates[key] = 'removed';
    }
    foundPhotos.forEach(function(ele, i, arr){
      registerPhotoState(ele.id);
    });
    sendPhotosToView(foundPhotos, 'prepend');
  });

  pubsub.on('recBtnClicked', function($btn){
    var photoID = $btn.closest('.photonRec').data('id');
    var payload = {
      photo: photoID
    };
    // // communicate with server NOTE version 1
    // $.post(serverURL + 'likedphotos/' + photoID, payload, function(data, status, xhr){
    //   // this function only runs on success as per $docs
    //   // on success, pass back to view
    //   console.log(status);
    //   pubsub.emit('recRegistered', $btn);
    // });
    // communicate with server NOTE version 2
    $.ajax({
      url: serverURL + 'likedphotos/' + photoID,
      method: 'POST'
    }).done(function(data, status, xhr){
        console.log(status);
        pubsub.emit('recRegistered', $btn);
    }).fail(function(xhr, status, error){
      console.log(status);
      console.log(error);
    });
  });



  //////////////////////////////////////////////////////////
  // auto loading images upon photo fetch, which is automatic upon user login
  pubsub.on('userPhotosFetched', function(){
    pubsub.emit('photosRequested', 'append');
  });
  pubsub.on('recPhotosFetched', function(){
    pubsub.emit('recPhotosRequested', 'append');
  });
  // USER CONTROLLER ///////////////////////////////////////

  //////////////////////////////////////////////////////////
  // cookies // NOTE: untested
  function setUserIDCookie(userObj){
    if (userObj){
      document.cookie = 'userID=' + userObj.id;
      return true;
    }
    console.log('setUserIDCookie: userObj missing');
    return false;
  }
  function getUserIDCookie(){
    return document.cookie.replace(/(?:(?:^|.*;\s*)userID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  }
  function removeUserIDCookie(){
    document.cookie = 'userID=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    return true;
  }

  //////////////////////////////////////////////////////////
  // user login and create user object


  //////////////////////////////////////////////////////////
  // fetching user photos from server
  function fetchPhotosFor(userObj){
    $.getJSON(serverURL + 'photos')
    .done(function(data){
      // NOTE: currently server returns an array, not JSON
      var photonImgs = [];
      data.forEach(function(ele, i, arr){
        photonImgs.push(new Photo(ele));
      });
      userObj.setPhotos(photonImgs);
      pubsub.emit('userPhotosFetched', userObj.photos.length);
    })
    .fail(function(xhr, status, error){
      console.log(status, error);
    });
    $.getJSON(serverURL + 'photos/recommended')
    .done(function(data){
      if (data.length === 0) {
        console.log('fetchRecPhotos: rec array is empty');
        return false;
      }
      // NOTE: currently server returns an array, not JSON
      var photonImgs = [];
      data.forEach(function(ele, i, arr){
        photonImgs.push(new Photo(ele, true));
      });
      userObj.setRecPhotos(photonImgs);
      pubsub.emit('recPhotosFetched', userObj.recPhotos.length);
    })
    .fail(function(xhr, status, error){
      console.log(status, error);
    });
  }

  function fetchShowTopPhotos(){
    $.getJSON(serverURL + 'photos/top_rated')
    .done(function(data){
      // NOTE: currently server returns an array, not JSON
      var photonImgs = [];
      data.forEach(function(ele, i, arr){
        photonImgs.push(new Photo(ele));
      });
      photonImgs.sort( function() { return 0.5 - Math.random(); } );
      var payload = photonImgs.slice(0, photoQtyPerRender * 2);
      sendPhotosToView(payload, 'append');
    })
    .fail(function(xhr, status, error){
      console.log(status, error);
    });
  }

  //////////////////////////////////////////////////////////
  // load user photos from user
  function getPhotosFrom(userObj, qty){
    var outputQty = qty;
    var photoArray = [];
    for (var i = 0; i < outputQty; i++){
      // shuffles array to get random photos each time
      // http://stackoverflow.com/questions/7158654/how-to-get-random-elements-from-an-array
      userObj.photos.sort( function() { return 0.5 - Math.random(); } );
      var aPhoto = userObj.photos[i];
      if (aPhoto === undefined){
        console.log('getPhotosFrom: no more user photos to load');
        // TODO: maybe emit an event for frontend
        outputQty = 0;
      } else if (isPhotoAlreadyLoaded(aPhoto.id)){
        outputQty++;
      } else {
        photoArray.push(aPhoto);
        registerPhotoState(aPhoto.id);
      }
    }
    console.log('usr photo loaded qty:', photoArray.length);
    return photoArray;
  }

  //////////////////////////////////////////////////////////
  // load recommended user photos from user
  function getRecPhotosFrom(userObj, qty){
    var outputQty = qty;
    var photoArray = [];
    for (var i = 0; i < outputQty; i++){
      // shuffles array to get random photos each time
      // http://stackoverflow.com/questions/7158654/how-to-get-random-elements-from-an-array
      userObj.recPhotos.sort( function() { return 0.5 - Math.random(); } );
      var aPhoto = userObj.recPhotos[i];
      if (aPhoto === undefined){
        console.log('getRecPhotosFrom: no more rec photos to load');
        // TODO: maybe emit an event for frontend
        outputQty = 0;
      } else if (isPhotoAlreadyLoaded(aPhoto.id)){
        outputQty++;
      } else {
        photoArray.push(aPhoto);
        registerPhotoState(aPhoto.id);
      }
    }
    console.log('rec photos loaded qty:', photoArray.length);
    return photoArray;
  }

  // PHOTO CONTROLLER //////////////////////////////////////

  //////////////////////////////////////////////////////////
  // send photos to view for rendering
  function sendPhotosToView(photoArray, direction){
    //direction: append, prepend
    var returnObj = {};
    returnObj.photos = photoArray;
    returnObj.direction = direction;
    pubsub.emit('renderImgsToPage', returnObj);
  }

  //////////////////////////////////////////////////////////
  // loading callback TODO: found this on StackOverflow
  // function preloadImage(imgObj, callback){
  //   var objImagePreloader = new Image();
  //   objImagePreloader.src = imgObj.url;
  //   if (objImagePreloader.complete){
  //     callback();
  //     objImagePreloader.onload=function(){};
  //   }
  //   else{
  //     objImagePreloader.onload = function() {
  //       callback();
  //       //    clear onLoad, IE behaves irratically with animated gifs otherwise
  //       objImagePreloader.onload=function(){};
  //     };
  //   }
  // }


  // STORAGE CONTROLLER ////////////////////////////////////

  //////////////////////////////////////////////////////////
  //


  // STATE LOGGER //////////////////////////////////////////

  //////////////////////////////////////////////////////////
  // what's already loaded
  var photoStates = {
    // example:
    // 456: 'loaded',
    // 789: 'removed',
  };
  function isPhotoAlreadyLoaded(id){
    return photoStates[id] == 'loaded';
  }

  function registerPhotoState(id){
    if (photoStates[id] === 'loaded'){
      console.log('registerPhotoState: duplicated detected, photo:', id);
      return false;
    }
    photoStates[id] = 'loaded';
    return true;
  }

  function updatePhotoState(id, status){
    if (id in obj) {
      photoStates[id] = status;
      return true;
    }
      console.log('updatePhotoState: ID doesn\'t exist', id);
      return false;
  }

  // this is more for construction and debugging
  function reportStates(){
    var loaded = [];
    var removed = [];
    (function(){
      for (var key in photoStates){
        if (photoStates[key] === 'loaded'){
          loaded.push(key);
        } else {
          removed.push(key);
        }
      }
    }());
    console.log('Registered QTY:', Object.keys(photoStates).length);
    console.log('Loaded:', loaded);
    console.log('Removed:', removed);
  }

  // SEARCH ////////////////////////////////////////////////

  //////////////////////////////////////////////////////////
  // sanitisation via whitelist of ltrs and nums
  function sanitise(str){
    return str.match(/\w+/g); //any alphaNumChar
  }

  function tagSearch(termsArr){
    var matchedPhotos = [];
    currentUser.photos.forEach(function(ele, i, arr){
      var allLabels = ele.tags.concat(ele.landmarks);
      loop1:
      for (var j = 0; j < allLabels.length; j++){
        var haystack = allLabels[j].toLowerCase();
        loop2:
        for (var k = 0; k < termsArr.length; k++){
          var needle = termsArr[k].toLowerCase();
          if (fuzzySearch(needle, haystack)) {
            matchedPhotos.push(ele);
            break loop1;
          }
        }
      }
    });
    return matchedPhotos;
  }

  //////////////////////////////////////////////////////////
  // as long as char appears in order in hay
  function fuzzySearch (needle, haystack) {
    var hLength = haystack.length;
    var nLength = needle.length;
    if (nLength > hLength) {
      return false;
    }
    if (nLength === hLength) {
      return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nLength; i++) {
      var nChar = needle.charCodeAt(i);
      while (j < hLength) {
        if (haystack.charCodeAt(j++) === nChar) {
          continue outer;
        }
      }
      return false;
    }
    return true;
  }


  //////////////////////////////////////////////////////////
  // testing variables

  //////////////////////////////////////////////////////////
  // driver code

  //////////////////////////////////////////////////////////
  // API
  return {
    currentUser: currentUser,
    reportStates: reportStates
  };
}(Photon.eventBus, Photon.view, Photon.User, Photon.Photo));
