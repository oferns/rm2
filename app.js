'use strict';

var express = require('express'); // The Express Application
var path = require('path'); // For resolving paths
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // Parsing the body into javascript objects and properties
var validator = require('express-validator'); // Used for validation and Sanitization of ALL input parameters and form values
var cp = {}; // TODO: Conneciton pool here
var app = express();
var error = require('./error');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json()); // For the API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());

app.locals.errors = {};

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(require('./routes/index')(cp));
app.use(error.notFound, error.serverError);

module.exports = app;