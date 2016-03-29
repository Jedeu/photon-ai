
if (!window.Photon) {
  window.Photon = {};
}
Photon.User = function(){
  var photos = [];
  var recommendedPhotos = [];
  // below is exporting of private vars
  this.photos = photos;
  this.recommendedPhotos = recommendedPhotos;
};

// Photon.User.prototype.getPhotos = function(){
//   return this.photos;
// };
Photon.User.prototype.setPhotos = function(photoArray){
  console.log('user photos was qty:', this.photos.length);
  this.photos = photoArray;
  console.log('user photos now has qty:', this.photos.length);
};
// Photon.User.prototype.getRecPhotos = function(){
//   return this.recommendedPhotos;
// };
Photon.User.prototype.setRecPhotos = function(photoArray){
  this.recommendedPhotos = photoArray;
};
