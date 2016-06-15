'use strict';

var express = require('express'); // The Express Application
var path = require('path'); // For resolving paths
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // Parsing the body into javascript objects and properties
var validator = require('express-validator'); // Used for validation and Sanitization of ALL input parameters and form values
var cp = {}; // TODO: Conneciton pool here
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json()); // For the API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());

app.locals.errors = {};

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(require('./routes/index')(cp));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {

    var status = err.status == 404 ? err.status : 500; // All 500 errors show the 500m page  
    res.status(err.status || 500);

    return res.render(status, {
        message: err.message,
        error: app.get('env') === 'production' ? {} : err
    });
});


module.exports = app;