'use strict';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var validator = require('express-validator');

module.exports = function () {
    var app = new express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(validator());
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');
    app.locals.errors = {};
    app.locals.user = {
        display_name: 'Joe Bloggs',
        email: 'devteam@nlsltd.com',
        nav: [
            { url: '/', title: 'Dashboard', current: true },
            { url: '/investments', title: 'Investments' }]

    };
    return app;
};
