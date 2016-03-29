
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
// async should go to the jQuery wrapper below, on doc ready
// NOTE: to be executed after modules have loaded
var photon = (function() {

  //////////////////////////////////////////////////////////
  // config important variables
  var serverURL = 'https://localhost:3000/';
  var monicasResizer = 'http://104.131.96.71/unsafe/fit-in/' + '800x8000/'; // width x height, then add img URL w/o http(s), ex: 'images.unsplash.com/photo-1431051047106-f1e17d81042f'
  var gridDict = {
    // example
    // 0.66: ['23'],
    // 0.5: ['12', '24']
  };


  //////////////////////////////////////////////////////////
  // fitting images to nestedJS grid, loading them to page
  (function genGrid (cols, rows){
    for (var i = 1; i < (cols+1); i++){
      for (var j = 1; j < (rows+1); j++){
        var ratio = (i / j).toString();
        if (!gridDict.hasOwnProperty(ratio)){
          gridDict[ratio] = [];
        }
        gridDict[ratio].push([i, j]);
      }
    }
    gridDict['1'].pop(); // removes 5x5 blocks from ratios of 1, they are too big
    return true;
  }(5,5)); // IIFE also makes it anon.

  // returns image spec object, can also pass it to a callback
  // in case of async issues on batch img processing
  // NOTE: conventionally a promise is used instead of callback
  function gridFitter(width, height, callback){
    var bestFit = {
      ratios: [],
      startErr: Infinity
    };
    var myAspRatio = width / height; // float, ex. 0.73, 1.25..
    for(var key in gridDict){
      var gridVal = gridDict[key];
      newErr = Math.abs(myAspRatio - Number(key)); // TODO: can add trim w/h to this
      if (newErr < bestFit.startErr) {
        bestFit.ratios = gridVal;
        bestFit.startErr = newErr;
      }
    }
    var randSample = bestFit.ratios[Math.floor(Math.random()*bestFit.ratios.length)];
    var output = {
      col: randSample[0],
      row: randSample[1],
      css: ''
    };
    if (myAspRatio > randSample[0]/randSample[1]){
      output.css = 'background-size: auto 100%;'; // width & height for CSS
    } else {
      output.css = 'background-size: 100% auto;';
    } // doesn't need one for 1:1, because no trim, ergo agnostic
    if (callback) {callback(output);}
    return output;
  }

  //////////////////////////////////////////////////////////
  // image loading to DOM's nest container
  // gridFitter also takes an optional callback in case of async issues
  function convertImgToNest (imgObj){
    var gridSpec = photon.gridFitter(imgObj.width, imgObj.height);
    var styleStr = 'background:url(' + imgObj.url + ') no-repeat center center;' + gridSpec.css;
    var tagStr = imgObj.tags;
    var nestClass = 'size' + gridSpec.col + gridSpec.row;
    var $imgElement = $('<div>').addClass('nestBox').addClass(nestClass);
    $imgElement.attr('style', styleStr);
    $imgElement.attr('data-tags', tagStr);
    $imgElement.attr('data-large-url', imgObj.url);
    return $imgElement;
  }

  function renderNestImages(imagesObj, direction){
    var imgArr = [];
    imagesObj.photos.forEach(function(ele, i, arr){
      imgArr.push(convertImgToNest(ele));
    });
    if (direction == 'prepend') {
      $('#nestContainer').prepend(imgArr).nested('prepend', imgArr);
    } else {
      $('#nestContainer').append(imgArr).nested('append', imgArr);
    }
  }


  //////////////////////////////////////////////////////////
  // for popupBox modal tags
  function renderTagsTo(dataStr, $target){
    var dataArray = dataStr.split(',');
    dataArray.forEach(function(ele, i, arr){
      $target.append($('<span>').addClass('tag').text(ele));
    });
  }


  //////////////////////////////////////////////////////////
  // search
  function fuzzysearch (needle, haystack) {
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
      return false;
    }
    if (nlen === hlen) {
      return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
      var nch = needle.charCodeAt(i);
      while (j < hlen) {
        if (haystack.charCodeAt(j++) === nch) {
          continue outer;
        }
      }
      return false;
    }
    return true;
  }


  //////////////////////////////////////////////////////////
  // User Data
  function PhotonUser(id){
    var photos = [];
    this.userID = id;
    this.getPhotos = function(){
      return photos;
    };
    this.writePhotos = function(photo){
      photos.push(photo);
    };
  }
  PhotonUser.prototype.fetch = function(){
    var url = serverURL + 'users/' + this.userID + '/photos';
    var writer = this.writePhotos;
    $.getJSON(url, null).done(function(data, response, xhr){
      data.forEach(function(ele, i, arr){
        writer(ele);
      });
    }).fail(function(xhr, status, error){
      console.log(error);
    });
  };


  //////////////////////////////////////////////////////////
  // Photo Data
  function PhotonPhoto(imgObj){
    this.id = imgObj.id;
    this.smallURL = null;
    this.url = imgObj.url;
    this.tags = imgObj.tags;
    this.height = imgObj.height || null;
    this.width = imgObj.width || null;
    this.people = [];
    this.landmark = [];
    this.safeSearch = {};
  }
  PhotonPhoto.prototype.resize = function(){
    if (!this.smallURL) {
      this.smallURL = monicasResizer + this.url.replace(/^http[s]*:[/]*/g, '');
    }
  };
  PhotonPhoto.prototype.findWidthHeight = function(callback){
    var photoObj = this;
    if (!this.width || !this.height) {
      var $tempImg = $('<img>').attr({
        src: this.url,
        id: 'photonImgFindSize'
      }).css({
        position: 'fixed',
        top: 0,
        left: 0,
        visibility: 'hidden',
        'z-index': -100
      });
      $('body').append($tempImg);
      $('#photonImgFindSize').on('load', function(){
        var $zeImg = $(this);
        photoObj.width = $zeImg.width();
        photoObj.height = $zeImg.height();
        console.log('img loaded');
        $zeImg.remove();
        if (callback){callback();}
      });
    }
  };


  var vanGogh = new PhotonPhoto({
    "id": 6,
    "url": "https://images.unsplash.com/photo-1432383079404-c66efb4828a3",
    "tags": [{"name":"sea","type":"label"},{"name":"coast","type":"label"},{"name":"water","type":"label"},{"name":"ocean","type":"label"},{"name":"shore","type":"label"},{"name":"reflection","type":"label"},{"name":"stack","type":"label"}]
  });
  var jason = new PhotonUser(15);
  //////////////////////////////////////////////////////////
  // API
  return {
    renderNestImages: renderNestImages,
    gridFitter: gridFitter,
    renderTagsTo: renderTagsTo,
    // below is during construction, can be removed
    fuzzysearch: fuzzysearch,
    jason: jason,
    vanGogh: vanGogh
  };
}());


////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// UI //////////////////////////////////////////////////////////


// photon jQuery wrapper for doc ready
// no API here (yet?)
$(function(){

  //////////////////////////////////////////////////////////
  // helpers while building
  function makeBoxes() {
    var boxes = [],
    count = Math.random()*15;
    if (count < 5) count = 5;
    for (var i=0; i < count; i++ ) {
      var box = document.createElement('div');
      box.className = 'nestBox size' +  Math.ceil( Math.random()*3 ) +  Math.ceil( Math.random()*3 );
      box.setAttribute('data-large-url', 'http://placehold.it/1200x800');
      box.setAttribute('data-tags', 'tag1,tag2,tag3,tag4,tag5,tag6');
      // add box DOM node to array of new elements
      boxes.push( box );
    }
    return boxes;
  }
  $('#nestPrepend').click(function(){
    var boxes = makeBoxes();
    $nContainer.prepend(boxes).nested('prepend',boxes);
  });
  $('#nestAppend').click(function(){
    var boxes = makeBoxes();
    $nContainer.append(boxes).nested('append',boxes);
  });
  $('#nestNuke').click(function(){
    $nContainer.children().remove();
    $nContainer.nested('refresh', nestOptions);
  });
  $('#testPrepend').on('click', function(){
    photon.renderNestImages(samplePhotosObj, 'prepend');
  });
  $('#testAppend').on('click', function(){
    photon.renderNestImages(samplePhotosObj);
  });

  //////////////////////////////////////////////////////////
  // all the vars for UI manipulation
  var defaultPadding = 5,
      scrollPoint = 300,
      $fixnav = $('.fixnav'),
      pLogo = document.querySelector('#wave'),
      $nContainer = $('#nestContainer'),
      $navPadding = $('.navpadding'),
      $window = $(window),
      $loginBox = $('#loginBox'),
      $loginBtn = $('#loginBtn'),
      $popupBox = $('#popupBox'),
      $modalBackgrounds = $('.modal-background'),
      $mainContent = $('main'),
      $menuBar = $('menu'),
      $menuToggle = $('.pMenuToggle'),
      $menuToggleBtn = $('#menuToggleBtn');
  var nestOptions = {
    minWidth: calcNestColWidth(),
    minColumns: 1,
    gutter: 5,
    centered: true,
    resizeToFit: false, // NOTE: do NOT make true, nested lib has a bug
    resizeToFitOptions: {
      resizeAny: true
    },
    animate: false,
    animationOptions: {
      speed: 20,
      duration: 100,
      queue: true,
      complete: function(){} // call back :D works w/ or w/o animate
    }
  };
  function calcNestColWidth(){
    var windowWidth = $window.width();
    if (windowWidth > 960) {
      return windowWidth / 10;
    } else if (windowWidth < 768) {
      return windowWidth / 4;
    } else {
      return windowWidth / 9;
    }
  }

  //////////////////////////////////////////////////////////
  // toggle entire page menu slide
  var menuUnhide = function(){
    if ($loginBox.hasClass('is-active') || $popupBox.hasClass('is-active')){
      return;
    }
    $mainContent.toggleClass('is-inactive');
    $menuBar.toggleClass('is-active');
    $menuToggle.toggleClass('is-active');
  };
  var menuHide = function(){
    $mainContent.removeClass('is-inactive');
    $menuBar.removeClass('is-active');
    $menuToggle.removeClass('is-active');
  };

  $menuToggleBtn.on('click', menuUnhide);
  $menuToggle.on('click', menuHide);
  Photon.eventBus.on('rightSwipe', menuUnhide);
  Photon.eventBus.on('leftSwipe', menuHide);



  //////////////////////////////////////////////////////////
  // NOTE: can be deprecated as nav no longer has dynamic height b/c tags
  // navpadding
  $navPadding.css('height', $fixnav.height() + defaultPadding);

  //////////////////////////////////////////////////////////
  // nestContainer
  $nContainer.nested(nestOptions);

  //////////////////////////////////////////////////////////
  // login pop up
  $modalBackgrounds.on('click', function(){ // reusable for all modal-backgrounds
    $('.modal').removeClass('is-active');
  });
  $loginBtn.on('click', function(){
    $loginBox.addClass('is-active');
  });

  //////////////////////////////////////////////////////////
  // nestBox pictures Modal
  $nContainer.on('click', '.nestBox', function(){
    var url = $(this).data('large-url');
    var tags = $(this).data('tags');
    var $tagField = $popupBox.find('div.image-custom');
    $tagField.children().remove();
    photon.renderTagsTo(tags, $tagField);
    $popupBox.find('img').attr('src', url);
    $popupBox.addClass('is-active');
  });
  $popupBox.on('click', function(){
    $(this).removeClass('is-active');
  });

  //////////////////////////////////////////////////////////
  // logo
  // forked from http://codepen.io/winkerVSbecks/pen/EVJGVj by Varun Vachhar
  (function buildWave(w, h) {
    var logoSmoothness = 0.5;
    var a = h / 4;
    var y = h / 2;
    var pathData = [
      'M', w * 0, y + a / 2,
      'c',
        a * logoSmoothness, 0,
        -(1 - a) * logoSmoothness, -a,
        a, -a,
      's',
        -(1 - a) * logoSmoothness, a,
        a, a,
      's',
        -(1 - a) * logoSmoothness, -a,
        a, -a,
      's',
        -(1 - a) * logoSmoothness, a,
        a, a,
      's',
        -(1 - a) * logoSmoothness, -a,
        a, -a,
      's',
        -(1 - a) * logoSmoothness, a,
        a, a,
      's',
        -(1 - a) * logoSmoothness, -a,
        a, -a,
      's',
        -(1 - a) * logoSmoothness, a,
        a, a,
      's',
        -(1 - a) * logoSmoothness, -a,
        a, -a,
      's',
        -(1 - a) * logoSmoothness, a,
        a, a,
      's',
        -(1 - a) * logoSmoothness, -a,
        a, -a,
      's',
        -(1 - a) * logoSmoothness, a,
        a, a,
      's',
        -(1 - a) * logoSmoothness, -a,
        a, -a,
      's',
        -(1 - a) * logoSmoothness, a,
        a, a,
      's',
        -(1 - a) * logoSmoothness, -a,
        a, -a
    ].join(' ');
    pLogo.setAttribute('d', pathData);
  }(90, 60));

});

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////
// sample data objects for testing, can delete when deploy
var samplePhotoObj1 = {
  "id": 6,
  "url": "https://images.unsplash.com/photo-1432383079404-c66efb4828a3",
  "tags": [{"name":"sea","type":"label"},{"name":"coast","type":"label"},{"name":"water","type":"label"},{"name":"ocean","type":"label"},{"name":"shore","type":"label"},{"name":"reflection","type":"label"},{"name":"stack","type":"label"}]
};

var samplePhotoObj2 = {
  id: 0,
  url: 'images/24.jpg',
  width: 1080,
  height: 654,
  tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
};

var samplePhotosObj = {
  photos: [
    {
      id: 0,
      url: 'images/22.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
    },
    {
      url: 'images/26.jpg',
      width: 1080,
      height: 717,
      tags: ['tag1', 'tag2', 'tag4', 'tag6']
    },
    {
      url: 'images/20.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag3', 'tag4', 'tag6']
    },
    {
      url: 'images/36.jpg',
      width: 720,
      height: 1080,
      tags: ['tag2', 'tag4', 'tag5']
    },
    {
      url: 'images/39.jpg',
      width: 1080,
      height: 720,
      tags: ['tag1', 'tag5', 'tag6']
    },
    {
      url: 'images/18.jpg',
      width: 1080,
      height: 720,
      tags: ['tag5', 'tag6']
    },
    {
      url: 'images/9.jpg',
      width: 1080,
      height: 720,
      tags: ['tag1', 'tag2', 'tag5', 'tag6']
    },
    {
      url: 'images/35.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag2']
    },
    {
      url: 'images/33.jpg',
      width: 950,
      height: 650,
      tags: ['tag1', 'tag2', 'tag6']
    },
    {
      url: 'images/31.jpg',
      width: 280,
      height: 280,
      tags: ['tag1', 'tag2', 'tag3', 'tag4']
    },
    {
      url: 'images/24.jpg',
      width: 1080,
      height: 654,
      tags: ['tag1', 'tag4', 'tag5', 'tag6']
    },
    {
      url: 'images/2.jpg',
      width: 1080,
      height: 391,
      tags: ['tag1', 'tag2', 'tag3', 'tag4']
    },
    {
      url: 'images/21.jpg',
      width: 1080,
      height: 608,
      tags: ['tag1', 'tag4', 'tag5', 'tag6']
    },
    {
      url: 'images/4.jpg',
      width: 1080,
      height: 720,
      tags: ['tag1', 'tag2', 'tag3']
    },
    {
      url: 'images/17.jpg',
      width: 1080,
      height: 720,
      tags: ['tag2', 'tag5', 'tag6']
    },
    {
      url: 'images/12.jpg',
      width: 1080,
      height: 720,
      tags: ['tag3', 'tag4']
    },
    {
      url: 'images/19.jpg',
      width: 1080,
      height: 719,
      tags: ['tag1', 'tag3', 'tag6']
    },
    {
      url: 'images/15.jpg',
      width: 1080,
      height: 683,
      tags: ['tag1', 'tag3', 'tag4', 'tag5']
    },
    {
      url: 'images/32.jpg',
      width: 1080,
      height: 721,
      tags: ['tag1', 'tag2', 'tag5', 'tag6']
    },
    {
      url: 'images/28.jpg',
      width: 1080,
      height: 705,
      tags: ['tag1', 'tag3', 'tag6']
    }
  ]
};
