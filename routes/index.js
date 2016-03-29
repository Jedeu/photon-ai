'use strict';

var configDB = require('../config/database.js');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(configDB.url);
var models = require('../models/index');
var Promise = Sequelize.Promise;

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('index.ejs', { message: req.flash('loginMessage'), loggedIn: req.isAuthenticated() });
  });

  // PHOTO STUFF

  /* GET random photos */
  // app.get('/photos', isLoggedOut, function(req, res, next) {

  // })

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

  /* GET a photo */
  // app.get('/photos/:id', function(req, res, next) {
  //   var id = req.params.id;
  //   models.photo.findById(id).then(function(photo) {
  //     res.json(photo);
  //   });
  // });

  /* POST new added photo (from chrome ext) */
  app.post('/addedphotos', function(req, res) {
    models.photo.create({
      url: req.body.url,
      height: req.body.height,
      width: req.body.width
    }).then(function(photo) {
      models.user.findById(req.body.user_id).then(function(user) {
        user.addLike(photo);
        user.addAdd(photo);
      });
      res.json(photo.url);
    });
  });

  /* POST new liked photo (from web app) */
  app.post('/likedphotos', function(req, res) {
    var id = req.body.photo_id;
    models.photo.findById(id).then(function(photo) {
      photo.addLiker(req.user);
    });
  });

  /* DELETE a liked photo */
  app.delete('/likedphotos/:id', function(req, res) {
    var id = req.params.id;
    models.photo.findById(id).then(function(photo) {
      photo.removeLiker(req.user);
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

  app.post('/login/ext', passport.authenticate('local-login', {
   successRedirect: '/login/ext',
   failureRedirect: '/',
   failureFlash: true
  }));

  app.get('/login/ext', function(req, res) {
    console.log(req.user.id);
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
    successRedirect: '/photos',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // facebook

  // send to facebook for authentication
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

  // handle callback after facebook has authenticated
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/photos',
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
          // tags.forEach(function(tag) {
          //   var tag_hash = {
          //     name: tag.name,
          //     type: tag.type
          //   };
          //   photo_hash.tags.push(tag_hash);
          // });
        });
        // .then(resolve_photo); // once we've iterated over each tag, move onto the next photo
      }); // promise

    }).then(function() { resolve_photos(user_photos); }); // end photos.forEach
  }); // end promise returned by addPhotos
} // end addPhotos
