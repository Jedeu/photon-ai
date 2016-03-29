this tutorial does setup and local authentication (email/pw)
https://scotch.io/tutorials/easy-node-authentication-setup-and-local#views-viewsindexejs-viewsloginejs-viewssignupejs

this tutorial does facebook authentication
https://scotch.io/tutorials/easy-node-authentication-facebook

Followed these tutorials, except placed config/passport.js stuff into app.js (our app.js is equivalent to the tutorials server.js). Did this because require(./app/index.js)(app, passport) throws an error... but this stuff probably shouldn't be in app.js. If I had to take a guess, this is probably where the bug is.

this is another tutorial specific to postgres/sequelize/passport, but only does local authentifaction
https://sarabinns.com/tag/passport-js-sequelize-postgresql/

this might be useful??
http://anneblankert.blogspot.ca/2015/06/node-authentication-migrate-from.html

