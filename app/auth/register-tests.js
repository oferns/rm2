'use strict';

var chai = require('chai');
var spies = require('chai-spies');
var sinon = require('sinon');
var assert = chai.assert;

chai.use(spies);

var should = chai.should();
var expect = chai.expect;

// The thing we are going to test
var register = require('./register');

// A valid mock request with just the properties and methods we want to test
var req = {
    'body': {
        'register': {
            'name': 'Testy McTestface',
            'register[email]': 'TeSt@test.com',
            'register[password]': 'Th1$1$4v4l1dP4$$w0rd',
            'register[repassword]': 'Th1$1$4v4l1dP4$$w0rd'
        }
    }
};

req.sanitizeBody = sinon.stub().returns(req),
    req.normalizeEmail = sinon.stub().returns(req),
    req.stripLow = sinon.stub().returns(req),
    req.check = sinon.stub().returns(req),
    req.equals = sinon.stub().returns(req),
    req.isEmail = sinon.stub().returns(req),
    req.notEmpty = sinon.stub().returns(req),
    req.isLength = sinon.stub().returns(req),
    req.withMessage = sinon.stub().returns(req),
    req.validationErrors = sinon.stub().returns(req)



describe('register', function () {
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

        it('should return a middleware function',function(){
            assert((typeof(func) ==  'function'),"Does not retunr a function");
            assert(func.length == 3,"Wrong number of argumnents, there should be 3");            
        })

        it('should call sanitizeBody and stripLow on register[name]', function (done) {

            var sanitizeSpy = chai.spy.on(req, 'sanitizeBody');
            var stripLowSpy = chai.spy.on(req, 'stripLow');

            var result = func(req, {}, function (err) {
                expect(sanitizeSpy).to.have.been.called.with('register[name]');
                expect(stripLowSpy).to.have.been.called;
                return done(err);
            });
        });

        it('should call sanitizeBody and normalizeEmail on register[email]', function (done) {

            var sanitizeSpy = chai.spy.on(req, 'sanitizeBody');
            var normalizeSpy = chai.spy.on(req, 'normalizeEmail');

            var result = func(req, {}, function (err) {
                expect(sanitizeSpy).to.have.been.called.with('register[email]');
                expect(normalizeSpy).to.have.been.called;

                return done(err);
            });
        });

        it('should call sanitizeBody and stripLow on register[password]', function (done) {

            var sanitizeSpy = chai.spy.on(req, 'sanitizeBody');
            var stripLowSpy = chai.spy.on(req, 'stripLow');

            var result = func(req, {}, function (err) {
                expect(sanitizeSpy).to.have.been.called.with('register[password]');
                expect(stripLowSpy).to.have.been.called;
                return done(err);
            });
        });

        it('should call sanitizeBody and stripLow on register[repassword]', function (done) {
            var req = {
                'body': {
                    'register[repassword]': 'Th1$1$4v4l1dP4$$w0rd'
                },
            };

            req.sanitizeBody = sinon.stub().returns(req);
            req.normalizeEmail = sinon.stub().returns(req);
            req.stripLow = sinon.stub().returns(req);

            var sanitizeSpy = chai.spy.on(req, 'sanitizeBody');
            var stripLowSpy = chai.spy.on(req, 'stripLow');

            var result = func(req, {}, function (err) {
                expect(sanitizeSpy).to.have.been.called.with.exactly('register[repassword]');
                expect(stripLowSpy).to.have.been.called;
                return done(err);
            });
        });

    });

    describe('validate', function () {
        var func = register({}).validate();

        it('should return a middleware function',function(){
            assert((typeof(func) ==  'function'),"Does not retunr a function");
            assert(func.length == 3,"Wrong number of argumnents, there should be 3");            
        })

        it('should call notEmpty, isLength, and withMessage register[name]', function (done) {
            var req = {
                'body': {
                    'register': {
                        'name': 'Testy McTestface',
                        'register[password]': 'Th1$1$4v4l1dP4$$w0rd',
                        'register[repassword]': 'Th1$1$4v4l1dP4$$w0rd'
                    }
                },
            };

            var res = {
                locals: {}
            }

            req.check = sinon.stub().returns(req);
            req.equals = sinon.stub().returns(req);

            req.isEmail = sinon.stub().returns(req);
            req.notEmpty = sinon.stub().returns(req);
            req.isLength = sinon.stub().returns(req);
            req.withMessage = sinon.stub().returns(req);
            req.validationErrors = sinon.stub().returns(req);

            var checkSpy = chai.spy.on(req, 'check');
            var notEmptySpy = chai.spy.on(req, 'notEmpty');
            var withMessageSpy = chai.spy.on(req, 'withMessage');

            var result = func(req, res, function (err) {
                expect(checkSpy).to.have.been.called.with.exactly('register[name]', 'An name is required.');
                expect(notEmptySpy).to.have.been.called;
                expect(withMessageSpy).to.have.been.called.with.exactly('Please enter a valid name');
                return done(err);
            });
        });

        it('should call notEmpty, isEmail, and withMessage register[email]', function (done) {
            var req = {
                'body': {
                    'register': {
                        'name': 'Testy McTestface',
                        'register[password]': 'Th1$1$4v4l1dP4$$w0rd',
                        'register[repassword]': 'Th1$1$4v4l1dP4$$w0rd'
                    }
                },
            };

            var res = {
                locals: {}
            }

            req.check = sinon.stub().returns(req);
            req.equals = sinon.stub().returns(req);
            req.isEmail = sinon.stub().returns(req);
            req.notEmpty = sinon.stub().returns(req);
            req.isLength = sinon.stub().returns(req);
            req.withMessage = sinon.stub().returns(req);
            req.validationErrors = sinon.stub();

            var checkSpy = chai.spy.on(req, 'check');
            var isEmailSpy = chai.spy.on(req, 'isEmail');
            var withMessageSpy = chai.spy.on(req, 'withMessage');

            var result = func(req, res, function (err) {
                expect(checkSpy).to.have.been.called.with.exactly('register[email]', 'An email address is required.');
                expect(isEmailSpy).to.have.been.called;
                expect(withMessageSpy).to.have.been.called.with.exactly('Please enter a valid email address');
                return done(err);
            })
        });

        it('should call notEmpty, isLength, and withMessage on register[password]', function (done) {
            var req = {
                'body': {
                    'register': {
                        'name': 'Testy McTestface',
                        'register[password]': 'Th1$1$4v4l1dP4$$w0rd',
                        'register[repassword]': 'Th1$1$4v4l1dP4$$w0rd'
                    }
                },
            };

            var res = {
                locals: {}
            }

            req.check = sinon.stub().returns(req);
            req.equals = sinon.stub().returns(req);
            req.isEmail = sinon.stub().returns(req);
            req.notEmpty = sinon.stub().returns(req);
            req.isLength = sinon.stub().returns(req);
            req.withMessage = sinon.stub().returns(req);
            req.validationErrors = sinon.stub().returns(req);

            var checkSpy = chai.spy.on(req, 'check');
            var isLengthSpy = chai.spy.on(req, 'isLength');
            var withMessageSpy = chai.spy.on(req, 'withMessage');

            var result = func(req, res, function (err) {
                expect(checkSpy).to.have.been.called.with.exactly('register[password]', 'A password is required');
                expect(isLengthSpy).to.have.been.called.with.exactly(6, 50);
                expect(withMessageSpy).to.have.been.called.with.exactly('Invalid password length. Should be between 6-50');
                return done(err);
            })
        });

        it('should call equals on password and repassword', function (done) {

            return done();
        });
    })
})