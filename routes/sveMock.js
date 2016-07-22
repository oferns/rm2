'use strict';

var savedThis;

function sveMock(statusCode, locals) {
    if (!(this instanceof sveMock)) {
        return new sveMock(statusCode);
    }
    this.statusCode = statusCode || 200;
    this.locals = locals || {};
    savedThis = this;
}

sveMock.prototype.sanitize = function (req, res, next) { return next() };

sveMock.prototype.validate = function (req, res, next) { return next() };

sveMock.prototype.execute = function (req, res, next) {
    res.statusCode = savedThis.statusCode;
    res.locals = savedThis.locals;
    return next();
};


module.exports = sveMock;