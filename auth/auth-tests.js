'use strict';

var crypto = require('crypto');

var chai = require('chai');
var spies = require('chai-spies');
var sinon = require('sinon');
var assert = chai.assert;

chai.use(spies);

var should = chai.should();
var expect = chai.expect;

var options = { 
    authKey: '0000000000000000000000000000000000000000000000000000000000000000',    
    hashBytes: 64,
    maxsaltLength: 20,
    minsaltLength: 15,
    maxiterations: 15000,
    miniterations: 5000,
}
const usercrypted = 'f9fd83c125c7df9a468d18b1b3d76214';
const useriv = '8ff8fe8554e5e8499bca885a60e9ca47';

const user = { 'name': 'test' };

describe('auth', function () {
    var auth = require('./auth');

    describe('CTor', function () {

        it('should return the auth object when passed an auth key', function () {
            expect(auth(options.authKey)).to.be.instanceof(auth);
        });

        it('should set the authKey property', function () {
            var obj = auth(options);
            expect(obj.authKey).to.not.be.an('undefined');
        });
    });

    describe('encryptObject', function () {
        it('should encrypt an object', function (done) {
            var obj = auth(options);
            obj.encryptObject(user, function (err, result) {
                expect(err).to.be.null;
                var parts = result.split(':');
                expect(parts.length).to.equal(2);
                return done();
            });
        });

        it('should return an error when passed an undefined value', function (done) {
            var obj = auth(options);
            obj.encryptObject(undefined, function (err, result) {
                expect(err).not.to.be.null;
                expect(err.message).to.equal('must start with number, buffer, array or string');
                return done();
            });
        });
    });

    describe('decryptObject', function () {
        it('should decrypt an object', function (done) {
            var obj = auth(options);
            obj.decryptObject(useriv, usercrypted, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.eql(user);
                done();
            });
        });

        it('should return an error when IV is incorrect', function (done) {
            var obj = auth(options);
            obj.decryptObject('nonsense', usercrypted, function (err, result) {
                expect(result).to.be.undefined;
                expect(err).not.to.be.null;
                expect(err.message).to.match(/:bad decrypt/);
                done();
            });
        });

        it('should return an error when encrypted object is incorrect', function (done) {
            var obj = auth(options);
            obj.decryptObject(useriv, 'a1b2c3d4e5', function (err, result) {
                expect(result).to.be.undefined;
                expect(err).not.to.be.null;
                expect(err.message).to.match(/:wrong final block length/);
                done();
            });
        });
    });

    describe('encryptPassword', function () {
        it('should return an error if the password is not a string', function (done) {
            var obj = auth(options);
            obj.encryptPassword({}, function (err, result) {
                expect(result).to.be.undefined;
                expect(err).not.to.be.null;
                expect(err.message).to.equal('password must be a string');
                done();
            })
        });

        it('should return an error if the password is a string of 0 length', function (done) {
            var obj = auth(options);
            obj.encryptPassword('', function (err, result) {
                expect(result).to.be.undefined;
                expect(err).not.to.be.null;
                expect(err.message).to.equal('password must be a string');
                done();
            })
        });

        it('should return an string if the password is a string', function (done) {
            var obj = auth(options);
            obj.encryptPassword('p', function (err, result) {
                expect(err).to.be.null;
                expect(result).to.be.an('string');
                done();
            })
        });
    });

    describe('verifyPassword', function () {

        it('should return true if the correct password is given', function (done) {
            var obj = auth(options);
            // This generates a random password each time the test is run
            var password = crypto.randomBytes(Math.floor(Math.random() * (20 - 15 + 1) + 15)).toString('hex');

            obj.encryptPassword(password, function (err, result) {
                expect(err).to.be.null;
                obj.verifyPassword(password, result, function (err, result) {
                    expect(err).to.be.null;
                    expect(result).to.be.true;
                    done();
                });
            });
        });

        it('should return false if the wrong password is given', function (done) {
            var obj = auth(options);
            var password = 'password';
            obj.encryptPassword('notpassword', function (err, result) {
                expect(err).to.be.null;
                obj.verifyPassword(password, result, function (err, result) {
                    expect(err).to.be.null;
                    expect(result).to.be.false;
                    done();
                });
            });
        });

        it('should return false if the wrong password is given', function (done) {
            var obj = auth(options);
            var password = 'password';
            obj.encryptPassword('notpassword', function (err, result) {
                expect(err).to.be.null;
                obj.verifyPassword(password, result, function (err, result) {
                    expect(err).to.be.null;
                    expect(result).to.be.false;
                    done();
                });
            });
        });
    });
});