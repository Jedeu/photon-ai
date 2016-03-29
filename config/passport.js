// Login Strategies
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var configDB = require('./database.js');
var Sequelize = require('sequelize');
var pg = require('pg');
var sequelize = new Sequelize(configDB.url);

var User = sequelize.import('../models/user');
User.sync();

var configAuth = require('./auth');

module.exports = function(passport) {
  // passport session setup (required for persistent login sessions)
  // passport needs to be able to serialize and unserialize users out of session

  // serialize user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      done(null, user);
    }).catch(function(e) {
      done(e, false);
    });
  });

  // local login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to check if a user is logged in or not
  },
  function(req, email, password, done) {
    User.findOne({ where: { localemail: email }})
      .then(function(user) {
        if (!user) { // user with that email doesn't exist
          done(null, false, req.flash('loginMessage', 'Invalid email or password'));
        } else if (!user.validPassword(password)) { // password is invalid
          done(null, false, req.flash('loginMessage', 'Invalid email or password'));
        } else { // successful login
          done(null, user);
        }
      })
      .catch(function(e) {
        done(null, false, req.flash('loginMessage', e.name + " " + e.message));
      });
  }));

  // local signup
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
  },
  function(req, email, password, done) {
    User.findOne({ where: { localemail: email }})
      .then(function(existingUser) {
        if (existingUser) { 
          return done(null, false, req.flash('loginMessage', 'Email is already taken')); 
        }
        // logged in => so we're connecting a new local account (updating account???)
        if (req.user) {
          var user = req.user;
          user.localemail = email;
          user.localpassword = User.generateHash(password);
          user.save().catch(function(err) {
            throw err;
          }).then(function() {
            done(null, user);
          });
        } else { // not logged in so create a new user
          var newUser = User.build({ localemail: email, localpassword: User.generateHash(password) })
          newUser.save().then(function() { 
              done(null, newUser); 
            })
            .catch(function(err) { 
              done(null, false, req.flash('loginMessage', err)); 
            });
        }
      })
      .catch(function(e) {
        done(null, false, req.flash('loginMessage', e.name + " " + e.message));
      })
  }));

  // facebook
  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    passReqToCallback: true // allows us to pass in the req from our route (i.e check if user is logged in or not)
  },
  function(req, token, refreshToken, profile, done) {
    // check if user is already logged in
    if (!req.user) {
      User.findOne({ where: { 'fbook_id': profile.id }})
        .then(function(user) {
          if (user) {
            // user id exists but no token (user was linked but was removed)
            if (!user.fbook_token) {
              user.fbook_token = token;
              user.name = profile.displayName;
              user.email = profile.emails[0].value;

              user.save()
                .then(function() { done(null, user); })
                .catch(function(e) {});
            } else { // user id exists and user already has a token
              done(null, user);
            }

          } else { // no user found so create one
            var newUser = User.build({
              fbook_id: profile.id,
              fbook_token: token,
              name: profile.displayName,
              email: profile.emails[0].value
            });
            newUser.save()
              .then(function() { done(null, user); })
              .catch(function(e) {});
          }
        });
    } else { // user already exists and is logged in so we need to link accounts
      var user = req.user; // pull user from session

      user.fbook_id = profile.id;
      user.fbook_token = token;
      user.name = profile.displayName;
      user.email = profile.emails[0].value;

      user.save()
        .then(function() { done(null, user); })
        .catch(function(e) {});
    }
  }));
};