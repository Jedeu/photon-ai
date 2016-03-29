'use strict';

var bcrypt = require('bcrypt-nodejs');
var faker = require('faker');
var models = require(__dirname + '/../models/index.js');
const NUM_PHOTOS = 300;

// SEED USERS

var i = 0;
while (i < 3) { // Create 1 users
  models.user.create({
    name: faker.name.firstName(),
    localemail: faker.internet.email(),
    localpassword: models.user.generateHash('password'),
    fbook_email: faker.internet.email(),
    fbook_id: '1237895',
    fbook_token: '1278959'
  });
  i++;
} 

// models.user.findById(1).then(assignPhotos);

// SEED LIKED_PHOTOS, ADDED_PHOTOS

// function assignPhotos(user) {
//   var x = 0;
//   while (x < 25) { // Randomly assign 25 photos to each user as like or add
//     var id = Math.floor((Math.random() * NUM_PHOTOS) + 1);
//     if ( id % 3 === 0 ) { // add user as liker
//       models.photo.findById(id).then(function(photo) {
//         photo.addLiker(user).then(function() {
//           photo.hasLiker(user).then(console.log); // should return true
//           user.hasLike(photo).then(console.log); // should return true
//         });
//       });    
//     } else { // add user as adder and as liker
//       models.photo.findById(id).then(function(photo) {
//         photo.addLiker(user).then(function() {
//           photo.hasLiker(user).then(console.log); // should return true
//           user.hasLike(photo).then(console.log); // should return true
//         }).then(function() {
//           photo.addAdder(user).then(function() {
//             photo.hasAdder(user).then(console.log); // should return true
//             user.hasAdd(photo).then(console.log); // should return true
//           });
//         });
//       });  
//     }
//     x++;
//   }
// }