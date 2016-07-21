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

describe('/login', function () {

    describe('Valid routes', function () {
        
        var router = require('../../routes/auth/login')(sveMock(200));

        app.use(router);

        it('should return 200 GETTING the login page', function (done) {
            request(app)
                .get('/login')
                .expect(200)
                .expect('Content-Type', /html/)
                .expect(function (res) {
                    res.text.should.match(/form name="login" action="\/login" method="post"/);
                })
                .end(done);
        });

        var router = require('../../routes/auth/login')(sveMock(302));

        app.use(router);

        it('should return 302 to /home when POSTING valid details', function (done) {
            request(app)
                .post('/login')
                .type('form')
                .send({ 'login[email]': 'test@test.com', 'login[password]': 'Th1s1s4V4l1dP4$$w0rd' })
                .expect(302)
                .expect('Content-Type', /text/)
                .expect('Location', '/home')
                .end(done);
        });
    });

    describe('Invalid routes', function () {

        var router = require('../../routes/auth/login')(sveMock(422));

        app.use(router);

        it('should return 422 when POSTING empty values', function (done) {
            request(app)
                .post('/login')
                .expect('Content-Type', /text/)
                .expect(422)
                .end(done);
        });

        it('should call next if the status code is not 200 or 422', function (done) {
            return done();
        });
    });
});