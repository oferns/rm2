'use strict';

var assert = require('assert');
var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);

var should = chai.should();
var expect = chai.expect;

var login = require('./login');

var validator = require('express-validator').validator;

var sanitizer = require('express-validator').sanitize;

describe('Login', function () {
    describe('CTor', function () {
        it('should throw an error when passed a null connection object', function () {
            assert.throws(function () {
                var l = login(null);
            }, function (err) {
                if ((err instanceof Error) && /cp is undefined/.test(err)) {
                    return true;
                }
            })
        });

        it('should return the Login object when passed an object', function () {
            assert.doesNotThrow(function () {
                var l = login({});

            }, Error, 'This error should not be thrown');
        });
    });

    describe('sanitize', function () {
        it('should call normalizeEmail the login[email] field', function () {

            var req = {
                'body': { 'login[email]': 'TeSt@test.com' },
                'sanitizeBody': function (field) {
                    return {
                        'normalizeEmail': validator.normalizeEmail
                    };
                }
            };

            var res = {};

            var sanitizeSpy = chai.spy.on(req, 'sanitizeBody');
            var normalizeSpy = chai.spy.on(validator, 'normalizeEmail');

            var result = login({}).sanitize(req, {}, function (err) {
                expect(sanitizeSpy).to.have.been.called.once;
                expect(normalizeSpy).to.have.been.called.once;
            });
        });
    });
})