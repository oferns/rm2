'use strict';

var chai = require('chai');
var spies = require('chai-spies');
var sinon = require('sinon');
var assert = chai.assert;

chai.use(spies);

var should = chai.should();
var expect = chai.expect;

var register = require('./register');
var reqMock = require('../reqMock');

describe('register', function () {

    var req, res;

    beforeEach(function () {
        req = new reqMock();
        res = { 'locals': {}, 'statusCode': 200 };
    });

    describe('CTor', function () {
        it('should throw an error when passed a null connection object', function (done) {
            assert.throws(function () {
                var l = register(null);
            }, /cp is undefined/);
            return done();
        });

        it('should return the Register object when passed an object', function (done) {
            var l = register({});
            assert.instanceOf(l, register, 'We have a register object');
            return done();
        });
    });

    describe('sanitize', function () {

        var func = register({}).sanitize();

        it('should return a middleware function', function () {
            assert((typeof (func) == 'function'), "Does not retunr a function");
            assert(func.length == 3, "Wrong number of argumnents, there should be 3");
        });

        it('should call sanitizeBody and stripLow on register[name]', function () {

            var result = func(req, res, function (err) {
                expect(req.sanitizeBodySpy).to.have.been.called.with('register[name]');
                expect(req.stripLowSpy).to.have.been.called;
            });
        });

        it('should call sanitizeBody and normalizeEmail on register[email]', function (done) {

            var result = func(req, {}, function (err) {
                expect(req.sanitizeBodySpy).to.have.been.called.with('register[email]');
                expect(req.normalizeEmailSpy).to.have.been.called;

                return done(err);
            });
        });

        it('should call sanitizeBody and stripLow on register[password]', function () {

            var result = func(req, {}, function (err) {
                expect(req.sanitizeBodySpy).to.have.been.called.with('register[password]');
                expect(req.stripLowSpy).to.have.been.called;
            });
        });

        it('should call sanitizeBody and stripLow on register[repassword]', function () {
            req.body['register'] = {};

            req.sanitizeBody = sinon.stub().returns(req);
            req.normalizeEmail = sinon.stub().returns(req);
            req.stripLow = sinon.stub().returns(req);

            var sanitizeSpy = chai.spy.on(req, 'sanitizeBody');
            var stripLowSpy = chai.spy.on(req, 'stripLow');

            var result = func(req, {}, function () {
                expect(sanitizeSpy).to.have.been.called.with.exactly('register[repassword]');
                expect(stripLowSpy).to.have.been.called;
            });
        });

    });

    describe('validate', function () {
        var func = register({}).validate();

        it('should return a middleware function', function () {
            assert((typeof (func) == 'function'), "Does not retunr a function");
            assert(func.length == 3, "Wrong number of argumnents, there should be 3");
        });

        it('should call notEmpty, isLength, and withMessage register[name]', function () {
            req.body['register'] = {};

            var result = func(req, res, function () {
                expect(req.checkSpy).to.have.been.called.with.exactly('register[name]', 'An name is required.');
                expect(req.notEmptySpy).to.have.been.called;
                expect(req.withMessageSpy).to.have.been.called.with.exactly('Please enter a valid name');
            });
        });

        it('should call notEmpty, isEmail, and withMessage register[email]', function () {
            req.body['register'] = {};

            var result = func(req, res, function () {
                expect(req.checkSpy).to.have.been.called.with.exactly('register[email]', 'An email address is required.');
                expect(req.isEmailSpy).to.have.been.called;
                expect(req.withMessageSpy).to.have.been.called.with.exactly('Please enter a valid email address');
            });
        });

        it('should call notEmpty, isLength, and withMessage on register[password]', function () {

            req.body['register'] = {};

            var result = func(req, res, function () {
                expect(req.checkSpy).to.have.been.called.with.exactly('register[password]', 'A password is required');
                expect(req.isLengthSpy).to.have.been.called.with.exactly(6, 50);
                expect(req.withMessageSpy).to.have.been.called.with.exactly('Invalid password length. Should be between 6-50');
            });
        });

        it('should call equals on password and repassword', function () {

            req.body['register'] = {};

            var result = func(req, res, function () {
                expect(req.checkSpy).to.have.been.called.with.exactly('register[repassword]', 'Passwords do not match');
                expect(req.equalsSpy).to.have.been.called.once.with.exactly(undefined);
            });
        });

        it('should set the req.errors object if the register property is not on the req.body', function () {
            var result = func(req, res, function () {
                assert(req.errors['field'] == 'Missing post info', "Incorrect error set");
            });
        });

        it('should set the res.statusCode to 422 if the register property is not on the req.body', function () {
            var result = func(req, res, function () {
                assert(res.statusCode == 422, "Incorrect statusCode, expect 422");
            });
        });
    });
});