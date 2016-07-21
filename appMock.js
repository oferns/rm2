'use strict';

var express = require('express');
var path = require('path'); // For resolving paths
var bodyParser = require('body-parser');
var validator = require('express-validator');

module.exports = function() {
    var app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(validator());
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'pug');
    return app;
};
