'use strict';

var chai = require('chai');
var spies = require('chai-spies');
var sinon = require('sinon');

chai.use(spies);


module.exports = function () {

    var req = {};
    req['sanitizeBody'] = sinon.stub().returns(req);
    req['normalizeEmail'] = sinon.stub().returns(req);
    req['check'] = sinon.stub().returns(req);
    req['notEmpty'] = sinon.stub().returns(req);
    req['isEmail'] = sinon.stub().returns(req);
    req['withMessage'] = sinon.stub().returns(req);
    req['isLength'] = sinon.stub().returns(req);
    req['stripLow'] = sinon.stub().returns(req);
    req['equals'] = sinon.stub().returns(req);

    req['validationErrors'] = sinon.stub().returns(false);

    req['sanitizeBodySpy'] = chai.spy.on(req, 'sanitizeBody');
    req['normalizeEmailSpy'] = chai.spy.on(req, 'normalizeEmail');
    req['checkSpy'] = chai.spy.on(req, 'check');
    req['notEmptySpy'] = chai.spy.on(req, 'notEmpty');
    req['isEmailSpy'] = chai.spy.on(req, 'isEmail');
    req['withMessageSpy'] = chai.spy.on(req, 'withMessage');
    req['isLengthSpy'] = chai.spy.on(req, 'isLength');
    req['stripLowSpy'] = chai.spy.on(req, 'stripLow');
    req['equalsSpy'] = chai.spy.on(req, 'equals');    
    req['validationErrorsSpy'] = chai.spy.on(req, 'validationErrors');

    req.body = {};
    req.query = {};
    req.params = {};

    return req;

}