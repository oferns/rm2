'use strict';

var reload = require('require-reload')(require);
var request = require('supertest');

var chai = require('chai');
var should = chai.should();

var appMock = require('../../appMock');
var sveMock = require('../sveMock');

describe('/account', function () {
    var app;
    beforeEach(function () {
        app = new appMock();
    });

    it('should return 200 GETTING the account page', function (done) {
        var mock = new sveMock(200);
        var router = reload('../../routes/auth/account')(mock);

        app.use(router);
        request(app)
            .get('/account')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect(function (res) {
                res.text.should.match(/Welcome to your account/);
            })
            .end(done);
    });

});