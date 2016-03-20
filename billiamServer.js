// NOTE this is billiam's sandbox server, run `node billiamServer.js` to start
// TODO integrate the static pages into node server for `npm start`

var connect = require('connect');
var serveStatic = require('serve-static');

// public is the directory that it's serving as `/`, default to index.html
connect().use(serveStatic('public')).listen(3000, function(){
    console.log('Billiam\'s sandbox running on 3000...');
});
