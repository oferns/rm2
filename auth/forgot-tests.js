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

});