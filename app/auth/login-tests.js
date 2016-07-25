'use strict';

var assert = require('assert');
var chai = require('chai');
var spies = require('chai-spies');
var sinon = require('sinon');
var assert = chai.assert;

chai.use(spies);

var should = chai.should();
var expect = chai.expect;


var login = require('./login');

var reqMock = require('../reqMock');

describe('login', function () {

    var req, res;

    beforeEach(function () {
        req = new reqMock();
        res = { 'locals': {}, 'statusCode': 200 };
    });

    describe('CTor', function () {
        it('should throw an error when passed a null connection object', function () {
            expect(function () {
                var l = login(null);
            }).to.throw(Error, /cp is undefined/);
        });

        it('should return the Login object when passed an object', function () {
            expect(login({})).to.be.instanceof(login);
        });
    });

    describe('sanitize', function () {
        var func = login({}).sanitize();

        it('should call normalizeEmail the login[email] field', function () {
            var result = func(req, {}, function () {
                expect(req.sanitizeBodySpy).to.have.been.called.once;
                expect(req.normalizeEmailSpy).to.have.been.called.once;
            });
        });
    });

    describe('validate', function () {
        var func = login({}).validate();

        it('should validate the email address', function () {
            func(req, res, function () {
                expect(req.checkSpy).to.have.been.called.with.exactly('login[email]', 'An email address is required.');
                expect(req.isEmailSpy).to.have.been.called.once;
                expect(req.notEmptySpy).to.have.been.called.twice;
                expect(req.withMessageSpy).to.have.been.called.with.exactly('Email is not valid');
            })
        });

        it('should validate the password', function () {
            func(req, res, function () {
                expect(req.checkSpy).to.have.been.called.with.exactly('login[password]', 'A password is required');
                expect(req.isLengthSpy).to.have.been.called.with.exactly(6, 50);
                expect(req.withMessageSpy).to.have.been.called.with.exactly('Invalid password length. Should be between 6-50');
            });
        });

        it('should set the res.locals.errors property', function(){
            func(req, res, function () {
                 expect(res.locals.errors).to.not.be.an('undefined');
            });
        });

        it('should set the res.statusCode property to a number', function(){
            func(req, res, function () {
                 expect(res.statusCode).to.be.an('Number');
            });            
        })
    });    
})