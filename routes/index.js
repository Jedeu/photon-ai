'use strict';

var configDB = require('../config/database.js');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(configDB.url);
var models = require('../models/index');
var Promise = Sequelize.Promise;
var fs = require('fs');
var request = require('request');
var secret_stuff = require('../secret_stuff/secret_stuff.js');

module.exports = function(app, passport, raccoon) {

  app.get('/', function(req, res) {
    res.render('index.ejs', { message: req.flash('loginMessage'), loggedIn: req.isAuthenticated() });
  });

  // PHOTO STUFF

  /* GET recommended photos */
  app.get('/photos/recommended', isLoggedIn, function(req, res) {
    var id = req.user.id;
    raccoon.recommendFor(id, 500, function(results) {
      console.log(results);
      models.photo.findAll({ where: { id: { in: results }}}).then(addPhotos).then(function(user_photos) {
        res.json(user_photos);
      });
    });
  });

  /* GET random photos */
  app.get('/photos/top_rated', function(req, res, next) {
    raccoon.bestRated(function(results) {
      models.photo.findAll({ where: { id: { in: results } } })
        .then(addPhotos)
          .then(function(user_photos) {
            res.json(user_photos);
          });
    });
  });

  /* GET user photos */
  app.get('/photos', isLoggedIn, function(req, res, next) {
    var id = req.user.id;
    models.user.findById(id)
      .then(function(user) {
        user.getLikes()
          .then(addPhotos)
            .then(function(user_photos) {
              res.json(user_photos);
            });
      });
  });

  /* POST new added photo (from chrome ext) */
  // add like and add add will only add if doesn't already exist! (i think..)
  app.post('/addedphotos', function(req, res) {
    models.photo.findOrCreate({ where: {
      url: req.body.url,
      height: req.body.height,
      width: req.body.width
    }}).spread(function(photo, created) {
      if (created) {
        seedTag(photo);
      }
      models.user.findById(req.body.user_id).then(function(user) {
        user.addLike(photo);
        user.addAdd(photo);
        raccoon.liked(user.id, photo.id, function() {});
      });
      res.json(photo.url);
    });
  });

  /* POST new liked photo (from web app) */
  app.post('/likedphotos/:id', function(req, res) {
    var id = req.params.id;
    models.photo.findById(id).then(function(photo) {
      models.user.findById(req.user.id).then(function(user) {
        user.addLike(photo);
        raccoon.liked(req.user.id, photo.id, function() { res.json('success') });
      });
    });
  });

  /* DELETE a liked photo */
  app.delete('/likedphotos/:id', function(req, res) {
    var id = req.params.id;
    models.photo.findById(id).then(function(photo) {
      models.user.findById(req.user.id).then(function(user) {
        user.removeLike(photo);
        raccoon.disliked(req.user.id, id, function() { res.json('success') });
      });
    });
  });

  // LOGIN STUFF //

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // AUTHENTICATE (FIRST LOGIN)

  // locally

  // show login form
  app.get('/login', isLoggedOut, function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // local login extension
  app.post('/login/ext', passport.authenticate('local-login', {
   successRedirect: '/login/ext',
   failureRedirect: '/',
   failureFlash: true
  }));

  // facebook login extension
  app.post('/login/ext/facebook', function(req, res) {
    models.user.findOrCreate({ where: { fbook_token: req.token } }).spread(function(user, created) {
      res.json(user.id);
    });
  });

  app.get('/login/ext', function(req, res) {
    res.json(req.user.id);
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
  }));

  // SIGNUP

  // show signup form
  app.get('/signup', isLoggedOut, function(req, res) {
    res.render('signup.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // facebook

  // send to facebook for authentication
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

  // handle callback after facebook has authenticated
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  }));

  // AUTHORIZE (ALREADY LOGGED IN)

  // facebook

  // send to facebook for authorization
  // app.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));

  // // handle callback after facebook has authorized
  // app.get('/connect/facebook/callback', passport.authorize('facebook', {
  //   successRedirect: '/profile',
  //   failureRedirect: '/'
  // }));

  // UNLINK ACCOUNTS

  // facebook

  // app.get('/unlink/facebook', function(req, res) {
  //   var user = req.user;
  //   user.fbook_token = null;
  //   user.save()
  //     .then(function() { res.redirect('/profile'); })
  //     .catch(function() { res.redirect('/profile'); });
  // });

};

function isLoggedOut(req, res, next) {
  if (req.isAuthenticated()) { res.redirect('/'); }
  return next();
}

function isLoggedIn(req, res, next) {
  // if authenticated, carry on
  if (req.isAuthenticated()) { return next(); }
  // otherwise, redirect
  res.redirect('/');
}

function addPhotos(photos) {
  // Make addPhotos return a promise.
  // This means when we call .then(addPhotos) on line 16, add photos won't return until the promise is resolved.
  // Once the promise is resolved, .then(function(user_photos) { .. }) will run, taking in the argument of resolve_photos(), user_photos.
  // return console.log(photos);
  return new Promise(function(resolve_photos, reject_photos) {

    var user_photos = [];

    // Iterate over photos as promises.
    // This way, we wait until the photo promise is resolved before moving on to the next photo
    Promise.each(photos, function(photo) {
      return new Promise(function(resolve_photo, reject_photo) {
        var photo_hash = {
          id: photo.id,
          url: photo.url,
          height: photo.height,
          width: photo.width,
          tags: []
        };

        user_photos.push(photo_hash);

        photo.getTags().then(function(tags) {
          // Iterate over tags as promises
          // This allows us to call .then() on each() so that we wait until the loop finishes before moving on
          Promise.each(tags, function(tag) {
            var tag_hash = {
              name: tag.name,
              type: tag.type
            };
            photo_hash.tags.push(tag_hash);
          }).then(resolve_photo); // once we've iterated over each tag, move onto the next photo
        });
        // .then(resolve_photo); // once we've iterated over each tag, move onto the next photo
      }); // promise

    }).then(function() { resolve_photos(user_photos); }); // end photos.forEach
  }); // end promise returned by addPhotos
} // end addPhotos

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
          "maxResults": 5
        },
        {
          "type": "LANDMARK_DETECTION",
          "maxResults": 10
        }
      ]
    }
  ]
};

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

    var faceAnnotations = body.responses[0].faceAnnotations;

    // 
    if (faceAnnotations && faceAnnotations[0]) {
      // console.log('\n\n\n' + faceAnnotations[0].joyLikelihood + '\n\n\n');
      if (faceAnnotations[0].joyLikelihood == 'VERY_LIKELY' || faceAnnotations[0].joyLikelihood == 'LIKELY') {
        console.log('\n\n HAPPY \n\n');
        tags.push({ name: 'happy', type: 'emotion' });
      }
      if (faceAnnotations[0].sorrowLikelihood == 'VERY_LIKELY' || faceAnnotations[0].sorrowLikelihood == 'LIKELY') {
        console.log('\n\n SAD \n\n');
        tags.push({ name: 'sad', type: 'emotion' });
      }
      if (faceAnnotations[0].angerLikelihood == 'VERY_LIKELY' || faceAnnotations[0].angerLikelihood == 'LIKELY') {
        console.log('\n\n ANGRY \n\n');
        tags.push({ name: 'angry', type: 'emotion' });
      }
      if (faceAnnotations[0].surpriseLikelihood == 'VERY_LIKELY' || faceAnnotations[0].surpriseLikelihood == 'LIKELY') {
        console.log('\n\n SURPRISED \n\n');
        tags.push({ name: 'surprised', type: 'emotion' });
      }
    }

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
