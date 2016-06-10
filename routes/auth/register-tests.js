'use strict';

var express = require('express');
var request = require('supertest');
var path = require('path');
var bodyParser = require('body-parser');
var validator = require('express-validator');

var app = express();

app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());

var assert = require('assert');
var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);

var should = chai.should();
var expect = chai.expect;


app.locals.errors = {};


describe('/register', function () {
    var register = require('../../app/auth/register')({});

    var registerMock = {
        sanitize: register.sanitize,
        validate: register.validate,
        execute: function (req, res, next) { return next() }
    };

    var router = require('../../routes/auth/register')(registerMock);

    app.use(router);

    it('should return 200 on the register page for anonymous user', function (done) {
        request(app)
            .get('/register')
            .expect('Content-Type', /html/)
            .expect(200)
            .end(done);
    });
});