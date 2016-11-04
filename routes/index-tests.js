'use strict';

var request = require('supertest');

var appMock = require('../appMock');
var indexRoute = require('./index');

describe('index', function () {
    var app = appMock();
    var router = indexRoute({});

    function ok(res) {
        if (res.status !== 200) {
            var b = http.STATUS_CODES[res.status];
            return new Error('expected 200, got ' + res.status + ' "' + b + '" with message: ' + res.text);
        }
    }

    describe('/', function () {
        it('should return 200 on the homepage', function (done) {

            app.use(router);
            request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(ok)
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