'use strict';

var fs = require('fs');
var request = require('request');
var models = require(__dirname + '/../models/index.js');
var secret_stuff = require('../secret_stuff/secret_stuff.js');

// GET PHOTO TAGS & SEED TAGS/PHOTO_TAGS

const MIN_LABEL_SCORE = 0.8;

var visionRequest = {
  "requests":[
    {
      "image": {
        "content": "<paste the contents of your base64-encoded output_file here>"
      },
      "features": [
        {
          "type": "SAFE_SEARCH_DETECTION",
          "maxResults": 5
        },
        {
          "type": "LABEL_DETECTION",
          "maxResults": 10
        },
        {
          "type": "FACE_DETECTION",
          "maxResults": 3
        },
        {
          "type": "LANDMARK_DETECTION",
          "maxResults": 10
        }
      ]
    }
  ]
};

models.photo.findAll().then(function(promises) {
  promises.forEach(function(photo) {
    seedTag(photo);
  });
});

var download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body) {
    if (err) { 
      return console.error(err);
    }
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

function seedTag(photo) {
  var file = 'seeders/temp/photo-' + photo.id + '.jpg';
  download(photo.url, file, convertToBase64);

  function convertToBase64(err, data) {
    if (err) {
      return console.error(err);
    }
    // update photos table to add height and width of photo
    fs.readFile(file, 'base64', sendToGoogleVision);
  }

  function sendToGoogleVision(err, data) {
    if (err) {
      return console.error(err);
    }
    visionRequest.requests[0].image.content = data;
    var request_options = {
      url: 'https://vision.googleapis.com/v1/images:annotate',
      qs: { key: secret_stuff.vision_key },
      method: 'POST',
      json: visionRequest
    };
    request(request_options, parseResponse);
  }

  function parseResponse(error, response, body) {
    if (error) {
      return console.error(error);
    }
    var tags = [];
    var landmarks = body.responses[0].landmarkAnnotations;
    var labels = body.responses[0].labelAnnotations;
    if (labels) {
      labels.forEach(function(label) {
        if (label.score >= MIN_LABEL_SCORE) {
          tags.push({ name: label.description, type: 'label' });
        }
      });
    }
    if (landmarks) {
      landmarks.forEach(function(landmark) {
        tags.push({ name: landmark.description, type: 'landmark' });
      });
    }
    tags.forEach(addTagToDB);
  }

  function addTagToDB(vision_tag) {
    models.tag.findOrCreate({ where: { name: vision_tag.name, type: vision_tag.type } }).then(function(promise) {
      var tag = promise[0];
      photo.addTag(tag).then(function() {
        photo.hasTag(tag).then(console.log);
        tag.hasPhoto(photo).then(console.log);
      });
    });
  }
}
