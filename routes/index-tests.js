'use strict';

var request = require('supertest');

var appMock = require('../appMock');
var indexRoute = require('./index');

describe('index', function () {
    var app = appMock();
    var router = indexRoute({});

    describe('/', function () {
        it('should return 200 on the homepage for anonymous user', function (done) {

            app.use(router);
            request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200)
                .end(done);
        });
    });

    describe('/style', function () {
        it('should return 200 on the stylepage for anonymous user', function (done) {

            app.use(router);
            request(app)
                .get('/style')
                .expect('Content-Type', /html/)
                .expect(200)
                .end(done);
        });
    });

    describe('/error', function () {
        it('should throw a Custom Error to test the 500 route', function (done) {

            app.use(router);
            request(app)
                .get('/error')
                .expect('Content-Type', /html/)
                .expect(500)
                .end(done);
        });
    });
});