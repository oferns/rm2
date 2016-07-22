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
        it('should call next', function (done) {
            var l = sveMock();
            var mock = {
                next: function () { }
            };

            var nextSpy = chai.spy.on(mock, 'next');
            l.sanitize({}, {}, mock.next);
            expect(nextSpy).to.have.been.called.once;
            return done();
        });
    });

    describe('validate', function () {
        it('should call next', function (done) {
            var l = sveMock();
            var mock = {
                next: function () { }
            };

            var nextSpy = chai.spy.on(mock, 'next');
            l.validate({}, {}, mock.next);
            expect(nextSpy).to.have.been.called.once;
            return done();

        });
    });

    describe('execute', function () {
        it('should set the statusCode on the response object (res)',function(done){
            var code = Math.floor(Math.random() * (600 - 100) + 100);
            var l = sveMock(code);
            var res = {};
            l.execute({},res,function(){});
            assert(res.statusCode === code);
            return done();                        
        });

        it('should call next', function (done) {
            var l = sveMock();
            var mock = {
                next: function () { }
            };

            var nextSpy = chai.spy.on(mock, 'next');
            l.validate({}, {}, mock.next);
            expect(nextSpy).to.have.been.called.once;
            return done();
        });

    });
});