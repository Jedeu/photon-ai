'use strict';

var express = require('express');
var path = require('path');
var app = express();
// var port = process.env.PORT || 3000;
var passport = require('passport');
var flash = require('connect-flash'); // store and retrieve messages in session store

var morgan = require('morgan'); // logger
var cookieParser = require('cookie-parser'); // parse cookies
var bodyParser = require('body-parser'); // parse posts
var session = require('express-session'); // session middleware
var raccoon = require('raccoon');

require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev')); // log requests to console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get info from html forms
app.use(express.static(path.join(__dirname, 'public'))); // static site
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating

app.use(session({
  secret: 'suchsecretsuchsession',
  resave: true,
  saveUninitialized: true
})); // session secretapp.use(passport.initialize());
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

raccoon.config.className = 'photo';
raccoon.connect(6379, '127.0.0.1')

// routes
require('./routes/index.js')(app, passport, raccoon); // load our routes and pass in our app and fully configured passport

app.use(function(err, req, res, next) {
  if(err) {
    console.log(err.stack);
  }
  next(err);
});

// launch
// app.listen(port);
// console.log('Listening on port' + port);

// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

// var session = require('express-session');
// var passport = require('passport');
// var flash = require('connect-flash');
// var FacebookStrategy = require('passport-facebook').Strategy;
// var models = require('./models/index.js');
// var configAuth = require('./config/auth');

// var routes = require('./routes/index'); // pass in fully configured passport for use in routing
// var users = require('./routes/users');

// var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// passport stuff
// app.use(session({
//   secret: 'suchsecretsuchsession',
//   resave: true,
//   saveUninitialized: true
// })); // session secret
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
// app.use(flash());

// app.use('/', routes);
// app.use('/users', users);
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'billiam')));

// // serialize user for the session
// passport.serializeUser(function(user, done) {
//   console.log('\n user serialized \n');
//   done(null, user.id);
// });

// // deserialize the user
// passport.deserializeUser(function(id, done) {
//   models.user.findById(id).then(function(err, user) {
//     console.log('\n user deserialized \n');
//     done(err, user);
//   });
// });

// passport.use('facebook', new FacebookStrategy({
//     clientID: configAuth.facebookAuth.clientID,
//     clientSecret: configAuth.facebookAuth.clientSecret,
//     callbackURL: configAuth.facebookAuth.callbackURL
//   },

//   function(token, refreshToken, profile, done) {
//     process.nextTick(function() {
//       // console.log(profile);
//       models.user.findOne({ where: { fbook_id: profile.id } }).then(function(err, user) {
//         if (err)
//           return done(err);

//         if (user) {
//           console.log(user);
//           return done(null, user);
//         } else {
//           models.user.create({
//             name: profile.displayName,
//             fbook_id: profile.id,
//             fbook_token: token
//           }).then(function(err, newUser) {
//             return done(null, newUser);
//           });
//         }
//       });
//     });
//   }
// ));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
