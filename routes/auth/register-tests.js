'use strict';

var reload = require('require-reload')(require);
var request = require('supertest');
var chai = require('chai');
var should = chai.should();

var appMock = require('../../appMock');
var sveMock = require('../sveMock');

describe('/register', function () {
    var app;
    beforeEach(function(){
        app = new appMock();
    })

    it('should return 200 on the register page for anonymous user', function (done) {
        var mock = sveMock(200, { 'register': {}, 'errors': {} });
        var router = reload('../../routes/auth/register')(mock);

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
        var mock = sveMock(200);
        var router = reload('../../routes/auth/register')(mock);
        
        app.use(router);
        request(app)
            .post('/register')
            .type('form')
            .expect(302)
            .expect('Content-Type', /text/)
            .expect('Location', '/thank-you')
            .end(done);
    });
});