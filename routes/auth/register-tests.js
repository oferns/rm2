'use strict';

var express = require('express');
var request = require('supertest');
var path = require('path');
var bodyParser = require('body-parser');
var validator = require('express-validator');

var app = express();

app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());

var assert = require('assert');
var chai = require('chai');
var spies = require('chai-spies');
var sinon = require('sinon');

chai.use(spies);

var should = chai.should();
var expect = chai.expect;

var sveMock = require('../sveMock');
app.locals.errors = {};


describe('/register', function () {

    var regMock = {
        'register[name]': 'test test',
        'register[email]': 'test@test.com',
        'register[password]': 'Th1s1s4V4l1dP4$$w0rd',
        'register[repassword]': 'Th1s1s4V4l1dP4$$w0rd',
    };

    var router = require('../../routes/auth/register')(new sveMock(200));

    app.use(router);

    it('should return 200 on the register page for anonymous user', function (done) {
        request(app)
            .get('/register')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect(function (res) {
                res.text.should.match(/form name="register" action="\/register" method="post"/);
            })
            .end(done);
    });

    it('should return 302 to /thank-you when POSTING valid details', function (done) {
        request(app)
            .post('/register')
            .type('form')
            .send(regMock)
            .expect(302)
            .expect('Content-Type', /text/)
            .expect('Location', '/thank-you')
            .end(done);
    });

});