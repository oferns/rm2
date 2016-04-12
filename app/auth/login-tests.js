'use strict';

var assert = require('assert');
var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);

var should = chai.should();
var expect = chai.expect;

describe('Login', function() {
    describe('CTor', function() {
        it('should throw an error when passed a null connection object', function() {
            assert.throws(function() {
                var login = require('./login')(null);
            }, function(err) {
                if ((err instanceof Error) && /cp is undefined/.test(err)) {
                    return true;
                }
            })
        });

        it('should return the Login object when passed an object', function() {
            assert.doesNotThrow(function() {
                var login = require('./login')({});
            }, Error, 'This erroor should not be thrown');
        });
    });
    
    describe('sanitize', function(){
        
    });
})