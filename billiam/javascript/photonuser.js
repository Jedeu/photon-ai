
if (!window.Photon) {
  window.Photon = {};
}
Photon.User = function(email){
  var userID = email.toLowerCase() || null; //num
  var photos = [];
  var recommendedPhotos = [];
  // below is exporting of private vars
  this.id = userID;
  this.photos = photos;
  this.recommendedPhotos = recommendedPhotos;
};

Photon.User.prototype.getPhotos = function(){
  return this.photos;
};
Photon.User.prototype.setPhotos = function(photoArray){
  console.log('fetching photos for user', this.id);
  console.log('photos was qty:', this.photos.length);
  this.photos = photoArray;
  console.log('photos now has qty:', this.photos.length);
};
Photon.User.prototype.getRecPhotos = function(){
  return this.recommendedPhotos;
};
Photon.User.prototype.setRecPhotos = function(photoArray){
  this.recommendedPhotos = photoArray;
};
