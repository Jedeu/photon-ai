
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
  var imgEmotions = null;
  // var imgSafesearch = null;
  var imgWidth = imgObj.width || null;
  var imgHeight = imgObj.height || null;
  var imgType = imgObj.type;

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
    var allEmotions = [];
    // var allSafeSearch = [];
    tagsArr.forEach(function(ele, i, arr){
      switch(ele.type){
        case 'label':
          allTags.push(ele.name);
          break;
        case 'landmark':
          allLandmarks.push(ele.name);
          break;
        case 'emotion':
          allEmotions.push(ele.name);
          break;
        // case 'safesearch':
        //   // TODO: build
        //   break;
      }
    });
    imgTags = allTags;
    imgLandmarks = allLandmarks;
    imgEmotions = allEmotions;
    // imgSafesearch = allSafeSearch;
  }(imgObj.tags));

  this.type = imgType;
  this.tags = imgTags;
  this.landmarks = imgLandmarks;
  this.emotions = imgEmotions;
  // this.safesearch = imgSafesearch;

  //NOTE: this one can be deprecated, been replaced by this.type
  //However, leaving it here until dependent modules are converted
  this.isRec = (function(){
    if (imgObj.type === 'rec'){
      return true;
    } else {
      return false;
    }
  }());

};

// NOTE: this is not needed for production
// exists because seed data lacks dimensions
// Photon.Photo.prototype.findWidthHeight = function(){
//   var photoObj = this;
//   if (!this.width || !this.height) {
//     var $tempImg = $('<img>').attr({
//       src: this.url,
//       id: 'photonImgFindSize' + photoObj.id
//     }).css({
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       visibility: 'hidden',
//       'z-index': -100
//     });
//     $('body').append($tempImg);
//     $('#photonImgFindSize' + photoObj.id).on('load', function(){
//       var $zeImg = $(this);
//       photoObj.width = $zeImg.width();
//       photoObj.height = $zeImg.height();
//       console.log('img dimensions found');
//       $zeImg.remove();
//     });
//   }
// };

// except from google vision:
// "joyLikelihood": "VERY_LIKELY",
// "sorrowLikelihood": "VERY_UNLIKELY",
// "angerLikelihood": "VERY_UNLIKELY",
// "surpriseLikelihood": "VERY_UNLIKELY",
// "underExposedLikelihood": "VERY_UNLIKELY",
// "blurredLikelihood": "VERY_UNLIKELY",
// "headwearLikelihood": "VERY_UNLIKELY"
//
// "adult": "VERY_UNLIKELY",
// "spoof": "VERY_UNLIKELY",
// "medical": "VERY_UNLIKELY",
// "violence": "UNLIKELY"
