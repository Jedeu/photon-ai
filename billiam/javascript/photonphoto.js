
if (!window.Photon) {
  window.Photon = {};
}

Photon.Photo = function(imgObj){
  // width x height, then add img URL w/o http(s), ex: 'images.unsplash.com/photo-1431051047106-f1e17d81042f'
  var monicasResizer = 'http://104.131.96.71/unsafe/fit-in/' + '800x4000/';

  var imgID = imgObj.id;
  var imgURL = imgObj.url;
  var imgSmallURL = imgObj.smallurl || null;
  var imgTags = null;
  var imgLandmarks = null;
  var imgPeople = null;
  var imgSafesearch = null;
  var imgWidth = imgObj.width || null;
  var imgHeight = imgObj.height || null;
  // below is exporting of private vars
  this.id = imgID;
  this.url = imgURL;
  this.smallURL = (function(){
    if(imgSmallURL){
      return imgSmallURL;
    }
    return monicasResizer + imgURL.replace(/^http[s]*:[/]*/g, '');
  }());
  this.height = imgHeight;
  this.width = imgWidth;

  (function parseTags(tagsArr){
    var allTags = [];
    var allLandmarks = [];
    var allPeople = [];
    var allSafeSearch = [];
    tagsArr.forEach(function(ele, i, arr){
      switch(ele.type){
        case 'label':
          allTags.push(ele.name);
          break;
        case 'landmark':
          // do stuff
          break;
        case 'people':
          // do stuff
          break;
        case 'safesearch':
          // do stuff
          break;
      }
    });
    imgTags = allTags;
    imgLandmarks = allLandmarks;
    imgPeople = allPeople;
    imgSafesearch = allSafeSearch;
  }(imgObj.tags));

  this.tags = imgTags;
  this.landmarks = imgLandmarks;
  this.people = imgPeople;
  this.safesearch = imgSafesearch;
};

// NOTE: this is not needed for production
// exists because seed data lacks dimensions
Photon.Photo.prototype.findWidthHeight = function(){
  var photoObj = this;
  if (!this.width || !this.height) {
    var $tempImg = $('<img>').attr({
      src: this.url,
      id: 'photonImgFindSize' + photoObj.id
    }).css({
      position: 'fixed',
      top: 0,
      left: 0,
      visibility: 'hidden',
      'z-index': -100
    });
    $('body').append($tempImg);
    $('#photonImgFindSize' + photoObj.id).on('load', function(){
      var $zeImg = $(this);
      photoObj.width = $zeImg.width();
      photoObj.height = $zeImg.height();
      console.log('img dimensions found');
      $zeImg.remove();
    });
  }
};
