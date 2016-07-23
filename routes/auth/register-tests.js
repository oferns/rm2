'use strict';

var request = require('supertest');

var appMock = require('../../appMock');
var sveMock = require('../sveMock');
var registerRoute = require('../../routes/auth/register');

describe('/register', function () {

    it('should return 200 on the register page for anonymous user', function (done) {
        var app = appMock();
        var mock = sveMock(200, { 'register': {}, 'errors': {} });
        var router = registerRoute(mock);

        app.use(router);
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
        var app = appMock();
        var mock = sveMock(200);
        var router = registerRoute(mock);
        
        app.use(router);
        request(app)
            .post('/register')
            .expect(302)
            .expect('Content-Type', /text/)
            .expect('Location', '/thank-you')
            .end(done);
    });
});