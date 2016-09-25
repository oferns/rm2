'use strict';

var chai = require('chai');
var spies = require('chai-spies');
var sinon = require('sinon');
var assert = chai.assert;

chai.use(spies);

var should = chai.should();
var expect = chai.expect;

var forgot = require('./forgot');
var reqMock = require('../reqMock');

describe('forgot', function () {

    var req, res;

    beforeEach(function () {
        req = new reqMock();
        res = { 'locals': {}, 'statusCode': 200 };
    });


    describe('sanitize', function () {
        var func = forgot({}).sanitize();

        it('should return a middleware function', function () {
            assert((typeof (func) == 'function'), "Does not return a function");
            assert(func.length == 3, "Wrong number of argumnents, there should be 3");
        });
    });
});