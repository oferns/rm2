'use strict';

function sveMock(statusCode, locals) {
    if (!(this instanceof sveMock)) {
        return new sveMock(statusCode, locals);
    }
    this.statusCode = statusCode || 200;
    this.locals = locals || {};
}

sveMock.prototype.sanitize = function () {
    return function (req, res, next) { return next() };
};
sveMock.prototype.validate = function () {
    return function (req, res, next) { return next() };
};

sveMock.prototype.execute = function () {
    var sc = this.statusCode;
    var l = this.locals;
    return function (req, res, next) {
        res.statusCode = sc;
        res.locals = l;
        return next();
    };
}


module.exports = sveMock;