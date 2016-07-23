'use strict';

var request = require('supertest');

var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var appMock = require('../../appMock');
var sveMock = require('../sveMock');
var loginRoute = require('../../routes/auth/login');

describe('/login', function () {

    it('should return 200 GETTING the login page', function (done) {
        var app = appMock();
        var mock = sveMock(200);
        var router = loginRoute(mock);
        app.use(router);
        request(app)
            .get('/login')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect(function (res) {
                res.text.should.match(/form name="login" action="\/login" method="post"/);
            })
            .end(done);
    });

    it('should return 302 to /home when POSTING valid details', function (done) {
        var app = appMock();
        var mock = sveMock(200);
        var router = loginRoute(mock);

        app.use(router);
        request(app)
            .post('/login')
            .type('form')
            .send({ 'login[email]': 'test@test.com', 'login[password]': 'Th1s1s4V4l1dP4$$w0rd' })
            .expect(302)
            .expect('Content-Type', /text/)
            .expect('Location', '/home')
            .end(done);
    });

    it('should return 422 when POSTING empty values', function (done) {
        var app = appMock();
        var mock = sveMock(422, { 'login': {}, 'errors': {} });
        var router = loginRoute(mock);

        app.use(router);
        request(app)
            .post('/login')
            .expect('Content-Type', /text/)
            .expect(422)
            .end(done);
    });

    it('should call next if the status code is not 200 or 422', function (done) {
        var app = appMock();
        var mock = sveMock(404);
        var router = loginRoute(mock);

        app.use(router);
        request(app)
            .post('/login')
            .expect('Content-Type', /text/)
            .expect(404)
            .end(done);
    });
});