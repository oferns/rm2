'use strict';

var express = require('express'); // The Express Application
var path = require('path'); // For resolving paths
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // Parsing the body into javascript objects and properties

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json()); // For the API
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index')();
app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


module.exports = app;