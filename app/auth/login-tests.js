'use strict';

var assert = require('assert');
var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);

var should = chai.should();
var expect = chai.expect;

var login = require('./login');

describe('Login', function() {
    describe('CTor', function() {
        it('should throw an error when passed a null connection object', function() {
            assert.throws(function() {
                login(null);
            }, function(err) {
                if ((err instanceof Error) && /cp is undefined/.test(err)) {
                    return true;
                }
            })
        });

        it('should return the Login object when passed an object', function() {
            assert.doesNotThrow(function() {
                login({});
            }, Error, 'This erroor should not be thrown');
        });
    });

    describe('sanitize', function() {
        it('should call normalizeEmail the login[email] field', function() {
            
            var stubs = {
                normalizeEmail: function() { },
                next: function(err, result) { return { err: err, result: result } }                
            };

            var req = {
                'body': { 'login[email]': 'TeSt@test.com' },
                'sanitizeBody': function(field) {
                    return {
                        'normalizeEmail':stubs.normalizeEmail
                    };
                }
            };

            var res = {};

            var sanitizeSpy = chai.spy.on(req, 'sanitizeBody');
            var normalizeSpy = chai.spy.on(stubs, 'normalizeEmail');
            var nextSpy = chai.spy.on(stubs, 'next');
            
            var result = login({}).sanitize(req, {}, stubs.next);
            
            expect(sanitizeSpy).to.have.been.called.once;
            expect(normalizeSpy).to.have.been.called.once;
            expect(nextSpy).to.have.been.called.once;

        });
    });
})