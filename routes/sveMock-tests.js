'use strict';

var chai = require('chai');
var spies = require('chai-spies');
var sinon = require('sinon');
var assert = chai.assert;

chai.use(spies);

var should = chai.should();
var expect = chai.expect;

var sveMock = require('./sveMock');

describe('sveMock', function () {

    describe('CTor', function () {
        it('should return the sveMock when called', function (done) {
            var l = sveMock(200);
            assert.instanceOf(l, sveMock, 'We have a sveMock object');
            return done();
        });

        it('should set the statusCode property to 200 when no value is passed in the CTor', function (done) {
            var l = sveMock();
            assert(l.statusCode === 200, 'Status codes do not match');
            return done();
        });

        it('should set the statusCode property passed in the CTor', function (done) {
            var code = Math.floor(Math.random() * (600 - 100) + 100);
            var l = sveMock(code);
            assert(l.statusCode === code, 'Status codes do not match');
            return done();
        })
    });

    describe('sanitize', function () {
        var func = sveMock().sanitize();

        it('should return a middleware function', function () {
            assert((typeof (func) == 'function'), "Does not retunr a function");
            assert(func.length == 3, "Wrong number of argumnents, there should be 3");
        })

        it('should call next', function (done) {

            var mock = {
                next: function () { }
            };

            var nextSpy = chai.spy.on(mock, 'next');

            func({}, {}, mock.next);
            expect(nextSpy).to.have.been.called.once;
            return done();
        });
    });

    describe('validate', function () {
        var func = sveMock().validate();

        it('should return a middleware function', function () {
            assert((typeof (func) == 'function'), "Does not retunr a function");
            assert(func.length == 3, "Wrong number of argumnents, there should be 3");
        })

        it('should call next', function (done) {
            var mock = {
                next: function () { }
            };

            var nextSpy = chai.spy.on(mock, 'next');
            func({}, {}, mock.next);
            expect(nextSpy).to.have.been.called.once;
            return done();

        });
    });

    describe('execute', function () {

        it('should return a middleware function', function () {
            var func = sveMock().execute();
            assert((typeof (func) == 'function'), "Does not retunr a function");
            assert(func.length == 3, "Wrong number of argumnents, there should be 3");
        })

        it('should set the statusCode on the response object (res)', function (done) {
            var code = Math.floor(Math.random() * (600 - 100) + 100);
            var func = sveMock(code).execute();
            var res = {};
            func({}, res, function () { });
            assert(res.statusCode === code);
            return done();
        });

        it('should call next', function () {            
            var mock = {
                next: function () { }
            };

            var func = sveMock().execute();
            var nextSpy = chai.spy.on(mock, 'next');
            func({}, {}, mock.next);
            expect(nextSpy).to.have.been.called.once;
        });
    });
});