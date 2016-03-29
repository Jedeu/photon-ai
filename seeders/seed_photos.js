'use strict';

var fs = require('fs');
var request = require('request');
var split = require('split');
var models = require(__dirname + '/../models/index.js');
// var sizeOf = require('image-size'); // bug... :(

// READ CSV

var readStream = fs.createReadStream('seeders/imglinks.csv');
var lineStream = readStream.pipe(split());
var i = 1;
lineStream.on('data', function(data) {
  models.photo.create({ url: data });
});

// ADD DIMENSIONS

// function addDimensions(url, i) {
//   var file = 'seeders/temp/photo-' + i + '.jpg';
//   download(url, file, getDimensions);

//   function download(url, filename, callback) {
//     request.head(url, function(err, res, body) {
//       if (err) { 
//         return console.error(err);
//       }
//       request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
//     });
//   }

//   function getDimensions(err, data) {
//     if (err) { return console.log(err); }
//     var dimensions = sizeOf(file);
//   }

// }

