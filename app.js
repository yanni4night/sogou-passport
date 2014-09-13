/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var swig = require('swig');

var app = express();

swig.setDefaults({
    cache: false,
    loader: swig.loaders.fs(__dirname + '/template')
});
// all environments
app.set('port', process.env.PORT || 3775);
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/template');
app.use(express.favicon(__dirname + "/src/img/favicon.ico"));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/web'));
express.static.mime.define({
    'text/plain': ['map']
});
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

/*app.get('/', function(req, res) {
    return res.redirect('/index.html');
});*/

app.get(/\/$/, function(req, res) {
    return res.redirect(req.path + 'index.html');
});

app.get(/\.html$/, function(req, res) {
    return res.render(req.path.replace(/(^\/|\.html$)/m,''));
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});