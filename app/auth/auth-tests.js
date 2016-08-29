'use strict';

var chai = require('chai');
var spies = require('chai-spies');
var sinon = require('sinon');
var assert = chai.assert;

chai.use(spies);

var should = chai.should();
var expect = chai.expect;

const authKey = '0000000000000000000000000000000000000000000000000000000000000000';

const usercrypted = 'f9fd83c125c7df9a468d18b1b3d76214';
const useriv = '8ff8fe8554e5e8499bca885a60e9ca47';

const user = { 'name': 'test' };

describe('auth', function () {
    var auth = require('./auth');

    describe('CTor', function () {

        it('should return the auth object when passed an auth key', function () {
            expect(auth(authKey)).to.be.instanceof(auth);
        });

        it('should set the authKey property', function () {
            var obj = auth(authKey);
            expect(obj.authKey).to.not.be.an('undefined');
        });
    });

    describe('encryptObject', function () {
        it('should encrypt an object', function (done) {
            var obj = auth(authKey);
            obj.encryptObject(user, function (err, result) {
                expect(err).to.be.null;
                var parts = result.split(':');
                expect(parts.length).to.equal(2);
                return done();
            });
        });

        it('should return an error when passed an undefined value', function(done){
            var obj = auth(authKey);
            obj.encryptObject(undefined, function (err, result) {
                expect(err).not.to.be.null;
                expect(err.message).to.equal('must start with number, buffer, array or string');
                return done();
            });
        });
    });

    describe('decryptObject', function(){
        it('should decrypt an object', function(done){
            var obj = auth(authKey);
            obj.decryptObject(useriv, usercrypted, function(err, result){
                expect(err).to.be.null;
                expect(result).to.eql(user);
                done();
            });
        });

        it('should return an error when IV is incorrect', function(done){
            var obj = auth(authKey);
            obj.decryptObject('nonsense', usercrypted, function(err, result){
                expect(result).to.be.undefined;
                expect(err).not.to.be.null;            
                expect(err.message).to.match(/:bad decrypt/);
                done();
            });
        });

        it('should return an error when encrypted object is incorrect', function(done){
            var obj = auth(authKey);
            obj.decryptObject(useriv, 'a1b2c3d4e5', function(err, result){
                expect(result).to.be.undefined;
                expect(err).not.to.be.null;            
                expect(err.message).to.match(/:wrong final block length/);
                done();
            });
        });        
    })
})


