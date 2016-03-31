
if (!window.Photon) {
  window.Photon = {};
}

Photon.view = (function(pubsub){

  //////////////////////////////////////////////////////////
  // GRID HANDLERS /////////////////////////////////////////
  //////////////////////////////////////////////////////////

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

  function gridFitter(width, height){
    if (!width || !height){
      console.log('gridFitter: missing width or height');
      return null;
    }
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
    return output;
  }

  //////////////////////////////////////////////////////////
  // IMAGE CONVERSION //////////////////////////////////////
  //////////////////////////////////////////////////////////
  function convertImgToNest(imgObj){
    var gridSpec = gridFitter(imgObj.width, imgObj.height);
    if (!gridSpec) {
      return null;
    }
    var smallerLink = imgObj.smallURL || imgObj.url;
    var styleStr = 'background:url(' + smallerLink + ') no-repeat center center;' + gridSpec.css;
    var nestClass = 'size' + gridSpec.col + gridSpec.row;
    var $imgElement = $('<div>').addClass('nestBox has-shadow').addClass(nestClass);
    if (imgObj.type === 'rec'){
      $imgElement.addClass('photonRec');
      var $payload = $('<div>').addClass('overlay');
      var $payloadHorse = $('<button>').addClass('button is-primary').text('+');
      $payload.append($payloadHorse);
      $imgElement.append($payload);
    } else {
      $imgElement.addClass('photonLiked');
    }
    $imgElement.attr('style', styleStr);
    $imgElement.attr('data-id', imgObj.id);
    $imgElement.attr('data-tags', imgObj.tags);
    $imgElement.attr('data-landmarks', imgObj.landmarks);
    $imgElement.attr('data-emotions', imgObj.emotions);
    $imgElement.attr('data-large-url', imgObj.url);
    return $imgElement;
  }

  function addUnlikeButtonTo($target){
    // target must be the nestBox container div
    var $payload = $('<button>').addClass('button is-small is-outlined').text('X');
    $target.find('.overlay').append($payload);
  }

  function renderTagsTo(dataStr, $target, colour){
    if (!dataStr){
      return;
    }
    var bulmaColourDict = {
      'white': '',
      'blue': 'is-info',
      'green': 'is-success',
      'yellow': 'is-warning',
      'red': 'is-danger',
      'black': 'is-dark'
    };
    var dataArray = dataStr.split(',');
    dataArray.forEach(function(ele, i, arr){
      $target.append($('<span>').addClass('tag').addClass(bulmaColourDict[colour]).text(ele));
    });
  }

  //////////////////////////////////////////////////////////
  // IMAGE RENDERING ///////////////////////////////////////
  //////////////////////////////////////////////////////////

  function renderNestImages(imagesObj, $target, direction){
    var imgArr = [];
    imagesObj.photos.forEach(function(ele, i, arr){
      imgArr.push(convertImgToNest(ele));
    });
    if (direction == 'prepend') {
      $target.prepend(imgArr).nested('prepend', imgArr);
    } else {
      $target.append(imgArr).nested('append', imgArr);
    }
  }

  function renderNestSingleImage(imgObj, direction){
    var $target = $('#nestContainer');
    var imgArr = [];
    imgArr.push(convertImgToNest(imgObj));
    if (direction == 'prepend') {
      $target.prepend(imgArr).nested('prepend', imgArr);
    } else {
      $target.append(imgArr).nested('append', imgArr);
    }
  }

  //////////////////////////////////////////////////////////
  // WRAPPER FOR DOM READY PARSE ///////////////////////////
  //////////////////////////////////////////////////////////
  $(function(){
  //////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////
    // all the vars for UI manipulation
    // defined once so $ doesn't query too frequently
    var defaultPadding = 5,
    scrollPoint = 300,
    $fixnav = $('.fixnav'),
    $pLogo = $('#wave'),
    $nestContainer = $('#nestContainer'),
    $nestBoxes = $('.nestBox'),
    $loginBox = $('#loginBox'),
    $loginBtn = $('#loginBtn'),
    $logoutBtn = $('#logoutBtn'),
    $popupBox = $('#popupBox'),
    $modals = $('.modal'),
    $modalBackgrounds = $('.modal-background'),
    $mainContent = $('main'),
    $menuBar = $('menu'),
    $menuToggle = $('.pMenuToggle'),
    $menuToggleBtn = $('#menuToggleBtn'),
    $searchGroup = $('#searchGroup'),
    $searchInput = $searchGroup.find('input.input'),
    $searchBtn = $('#searchBtn'),
    $refreshBtn = $('#refreshBtn'),
    $sizeUp = $('#sizeUp'),
    $sizeDown = $('#sizeDown'),
    $sizeNumerator = $('#sizeNumerator'),
    $statsLiked = $('#statsLiked'),
    $statsDiscovered = $('#statsDiscovered'),
    $statsDisplaying = $('#statsDisplaying'),
    $window = $(window);

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
        complete: function(){} // NOTE: optional call back :D works w/ or w/o animate
      }
    };

    // optimising for mobile, tablet, desktop
    function calcNestColWidth(){
      var windowWidth = $window.width();
      if (windowWidth > 1024) {
        return windowWidth / 14;
      } else if (windowWidth < 768) {
        return windowWidth / 4;
      } else {
        return windowWidth / 9;
      }
    }

    //////////////////////////////////////////////////////////
    // server-side auth, workaround without passing around tokens
    if (document.getElementById("logoutBtn")) {
      pubsub.emit('userLoggedIn', null);
    }

    if (document.getElementById("loginBtn")) {
      pubsub.emit('noUserLoggedIn', null);
      $searchGroup.hide();
      $statsLiked.hide();
      $statsDiscovered.hide();
    }

    //////////////////////////////////////////////////////////
    // nestContainer
    $nestContainer.nested(nestOptions);

    //////////////////////////////////////////////////////////
    // event listeners from controller
    pubsub.on('renderImgsToPage', function(photoObj){
      renderNestImages(photoObj, $nestContainer, photoObj.direction);
    });

    pubsub.on('userPhotosNormalised', function(pPhotos){
      updateNavStats($statsLiked, pPhotos.length);
    });

    pubsub.on('nukePhotosFromView', function(commandOrArr){
      switch (typeof(commandOrArr)) {
      case 'string':
        if (commandOrArr === 'all') {
          nukeAllPhotos();
        }
        break;
      case 'object':
        nukeSelectedPhotos(commandOrArr);
        break;
      default:
        console.log('view: nuke listener switch: invalid command or array');
        break;
      }
    });

    //////////////////////////////////////////////////////////
    // navbar stats
    function updateNavStats($target, qty){
      $target.children('.title').text(qty);
    }

    pubsub.on('renderImgsToPage', function(photosObj){
      var currentVal = $nestContainer.children('.nestBox').length;
      updateNavStats($statsDisplaying, currentVal);
    });

    pubsub.on('allPhotosNuked', function(boolean){
      if (boolean){
        updateNavStats($statsDisplaying, 0);
      }
    });

    pubsub.on('somePhotosNuked', function(qty){
      var current = +$statsDisplaying.find('.title').text();
      var newVal = current - qty;
      updateNavStats($statsDisplaying, newVal);
    });

    pubsub.on('recRegistered', function(){
      var prevLiked = +$statsLiked.find('.title').text();
      prevLiked++;
      updateNavStats($statsLiked, prevLiked); //initialise for this session
      var prevDiscov = +$statsDiscovered.find('.title').text();
      prevDiscov++;
      updateNavStats($statsDiscovered, prevDiscov); //initialise for this session
    });

    pubsub.on('unlikeRegistered', function(){
      var current = +$statsLiked.find('.title').text();
      var newVal = current - 1;
      updateNavStats($statsLiked, newVal);
    });

    //////////////////////////////////////////////////////////
    // toggle entire page menu slide
    $menuToggleBtn.on('click', menuUnhide);
    $menuToggle.on('click', menuHide);
    pubsub.on('rightSwipe', menuUnhide);
    pubsub.on('leftSwipe', menuHide);

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

    //////////////////////////////////////////////////////////
    // sidebar functions
    var optimizedWidth = calcNestColWidth();

    $sizeUp.on('click', function(){
      var newVal = +$sizeNumerator.text() + 1;
      nestOptions.minWidth += 30;
      $sizeNumerator.text(newVal);
      $nestContainer.nested('refresh', nestOptions);
    });

    $sizeDown.on('click', function(){
      var newVal = +$sizeNumerator.text() - 1;
      nestOptions.minWidth -= 30;
      $sizeNumerator.text(newVal);
      $nestContainer.nested('refresh', nestOptions);
    });

    //////////////////////////////////////////////////////////
    // removal of photos
    function nukeAllPhotos(){
      $nestContainer.children().remove();
      $nestContainer.nested('refresh', nestOptions);
      pubsub.emit('allPhotosNuked', true);
    }

    //////////////////////////////////////////////////////////
    // login pop up
    $modalBackgrounds.on('click', function(){ // reusable for all modal-backgrounds
      $modals.removeClass('is-active');
    });

    $loginBtn.on('click', function(){
      $loginBox.addClass('is-active');
    });

    $logoutBtn.on('click', function(){
      $logoutBtn.addClass('is-loading');
    });

    $loginBox.on('click', 'button', function(){
      $(this).addClass('is-loading');
    });


    //////////////////////////////////////////////////////////
    // recommended photos handling and UI
    // the rec photo is tied to the '.is-primary' class, also makes it turquoise
    $nestContainer.on('click', '.is-primary', function(evt){
      evt.stopPropagation();
      $btn = $(this);
      $btn.addClass('is-loading');
      pubsub.emit('recBtnClicked', $btn); // controller subscribes
    });

    pubsub.on('recRegistered', function($btn){
      $parent = $btn.closest('.nestBox');
      $btn.removeClass('is-primary').removeClass('is-loading').addClass('is-success').text('added');
      $btn.prop('disabled', true);
      setTimeout(function(){
        $btn.remove();
        $parent.addClass('photonLiked').removeClass('photonRec');
        addUnlikeButtonTo($parent);
      }, 800);
    });

    // helper to hide elements for non-loggedin users
    function getCookie(key){
      var regexStr = '/(?:(?:^|.*;\s*)' + key + '\s*\=\s*([^;]*).*$)|^.*$/';
      return document.cookie.replace(regexStr, "$1");
    }

    //////////////////////////////////////////////////////////
    // photo unliking
    $nestContainer.on('mouseenter', '.photonLiked', function(enterEvt){
      var isLoggedIn = getCookie('loggedIn');
      if (isLoggedIn !== 'loggedIn=true'){
        return;
      }
      if ($(this).children('.overlay').length === 0) {
        var $payload = $('<div>').addClass('overlay');
        var $payloadHorse = $('<button>').addClass('button is-small is-outlined').text('X');
        $payload.append($payloadHorse);
        $(this).append($payload);
      }
    });

    $nestContainer.on('mouseenter', ".nestBox:not('.photonRec')", function(evt){
      $(this).find('.overlay').show();
    });

    $nestContainer.on('mouseleave', ".nestBox:not('.photonRec')", function(evt){
      $(this).find('.overlay').hide();
    });

    // the unlike button is tied to the '.is-small' class
    $nestContainer.on('click', '.is-small', function(evt){
      evt.stopPropagation();
      $btn = $(this);
      $btn.addClass('is-loading');
      pubsub.emit('unlikeBtnClicked', $btn); // controller subs
    });

    pubsub.on('unlikeRegistered', function($btn){
      $btn.removeClass('is-loading').addClass('is-success').text('unlike');
      $btn.prop('disabled', true);
      setTimeout(function(){
        $btn.closest('.nestBox').remove();
        pubsub.emit('somePhotosNuked', 1);
        $nestContainer.nested('refresh', nestOptions);
      }, 800);
    });

    //////////////////////////////////////////////////////////
    // nestBox pictures Modal
    $nestContainer.on('click', '.nestBox', function(){
      var url = $(this).data('large-url');
      var tags = $(this).data('tags');
      var landmarks = $(this).data('landmarks');
      var emotions = $(this).data('emotions');
      // var safesearch = $(this).data('safesearch');
      var $tagField = $popupBox.find('div.image-custom');
      $tagField.children().remove();
      renderTagsTo(tags, $tagField, 'blue');
      renderTagsTo(landmarks, $tagField, 'yellow');
      renderTagsTo(emotions, $tagField, 'green');
      // renderTagsTo(safesearch, $tagField, 'red');
      $popupBox.find('img').attr('src', url);
      $popupBox.addClass('is-active');
    });

    $popupBox.on('click', function(){
      $(this).removeClass('is-active');
    });

    //////////////////////////////////////////////////////////
    // search
    function fireSearchRequest(){
      var text = $searchInput.val();
      pubsub.emit('searchRequested', text);
      $searchInput.val('');
    }

    $searchBtn.on('click', function(){
      fireSearchRequest();
    });

    $searchInput.on('keypress', function(evt){
      if (evt.keyCode == 13){
        fireSearchRequest();
      }
    });

    $searchInput.on('blur', function(evt){
      fireSearchRequest();
    });

    // refresh page option to clear search
    $refreshBtn.on('click', function(evt){
      pubsub.emit('nukePhotosFromView', 'all');
      pubsub.emit('photosRequested', 'append');
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
      $pLogo.attr('d', pathData);
    }(90, 60));
  });

  // NOTE: API has been converted mostly to eventbus driven
  // can probably be deprecated pending testing
  // API
  return {
    POST: 'status: view is loaded',
  };

}(Photon.eventBus));
