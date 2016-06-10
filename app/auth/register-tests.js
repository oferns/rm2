'use strict';

var assert = require('assert');
var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);

var should = chai.should();
var expect = chai.expect;

var register = require('./register');

var validator = require('express-validator').validator;

var sanitizer = require('express-validator').sanitize;


describe('register', function () {
    describe('CTor', function () {
        it('should throw an error when passed a null connection object', function () {
            assert.throws(function () {
                var l = register(null);
            }, function (err) {
                if ((err instanceof Error) && /cp is undefined/.test(err)) {
                    return true;
                }
            })
        });

        it('should return the Register object when passed an object', function () {
            assert.doesNotThrow(function () {
                var l = register({});

            }, Error, 'This error should not be thrown');
        });
    });

    describe('sanitize', function () {
        it('should call normalizeEmail the register[email] field', function () {

            var req = {
                'body': { 'register[email]': 'TeSt@test.com' },
                'sanitizeBody': function (field) {
                    return {
                        'normalizeEmail': validator.normalizeEmail
                    };
                }
            };

            var res = {};

            var sanitizeSpy = chai.spy.on(req, 'sanitizeBody');
            var normalizeSpy = chai.spy.on(validator, 'normalizeEmail');

            var result = register({}).sanitize(req, {}, function (err) {
                expect(sanitizeSpy).to.have.been.called.once;
                expect(normalizeSpy).to.have.been.called.once;
            });
        });
    });
})