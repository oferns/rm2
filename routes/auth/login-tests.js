'use strict';

var reload = require('require-reload')(require);
var request = require('supertest');

var chai = require('chai');
var should = chai.should();

var appMock = require('../../appMock');
var sveMock = require('../sveMock');

describe('/login', function () {
    var app;
    beforeEach(function(){
        app = new appMock();
    })

    it('should return 200 GETTING the login page', function (done) {
        var mock = new sveMock(200);
        var router = reload('../../routes/auth/login')(mock);
        
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
        var mock = new sveMock(200);
        var router = reload('../../routes/auth/login')(mock);

        app.use(router);
        request(app)
            .post('/login')
            .type('form')
            .expect(302)
            .expect('Content-Type', /text/)
            .expect('Location', '/home')
            .end(done);
    });

    it('should return 422 when POSTING empty values', function (done) {
        var mock = sveMock(422, { 'login': {}, 'errors': {} });
        var router = reload('../../routes/auth/login')(mock);

        app.use(router);
        request(app)
            .post('/login')
            .type('form')
            .expect('Content-Type', /text/)
            .expect(422)
            .end(done);
    });

    it('should call next if the status code is not 200 or 422', function (done) {
        var mock = sveMock(404, {});
        var router = reload('../../routes/auth/login')(mock);

        app.use(router);
        request(app)
            .post('/login')
            .type('form')
            .expect(404)
            .expect('Content-Type', /text/)
            .end(done);
    });
});