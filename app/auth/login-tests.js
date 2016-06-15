'use strict';

var assert = require('assert');
var chai = require('chai');
var spies = require('chai-spies');
var sinon = require('sinon');

chai.use(spies);

var should = chai.should();
var expect = chai.expect;

var login = require('./login');

describe('Login', function () {
    describe('CTor', function () {
        it('should throw an error when passed a null connection object', function () {
            assert.throws(function () {
                var l = login(null);
            }, function (err) {
                if ((err instanceof Error) && /cp is undefined/.test(err)) {
                    return true;
                }
            });
        });

        it('should return the Login object when passed an object', function (done) {
            assert.doesNotThrow(function () {
                var l = login({});
            }, Error, 'This error should not be thrown');
            return done();
        });
    });

    describe('sanitize', function () {
        it('should call normalizeEmail the login[email] field', function (done) {

            var req = {
                'body': { 'login[email]': 'TeSt@test.com' },
            };

            req.sanitizeBody = sinon.stub().returns(req);
            req.normalizeEmail = sinon.stub().returns(req);

            var sanitizeSpy = chai.spy.on(req, 'sanitizeBody');
            var normalizeSpy = chai.spy.on(req, 'normalizeEmail');

            var result = login({}).sanitize(req, {}, function (err) {
                expect(sanitizeSpy).to.have.been.called.once;
                expect(normalizeSpy).to.have.been.called.once;
                return done();
            });
        });
    });

    describe('validate', function () {
        it('should validate the email address', function(done){

            return done();
        });
    });
})