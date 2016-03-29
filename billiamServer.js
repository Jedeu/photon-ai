// NOTE this is the billiam static server, run `node billiamServer.js` to start
// TODO integrate the static pages into node server for `npm start`

var connect = require('connect');
var serveStatic = require('serve-static');

// public is the directory that it's serving as `/`, default to index.html
connect().use(serveStatic('billiam')).listen(4000, function(){
    console.log('billiam folder running on 4000...');
});
