'use strict';

function sveMock(statusCode) {
    if (!(this instanceof sveMock)) {
        return new sveMock(statusCode);
    }
    this.statusCode = statusCode || 200;
}

sveMock.prototype.sanitize = function () {
    return function (req, res, next) { return next() };
};
sveMock.prototype.validate = function () {
    return function (req, res, next) { return next() };
};

sveMock.prototype.execute = function () {
    var sc = this.statusCode;
    return function (req, res, next) {
        res.statusCode = sc;
        return next();
    };
}

module.exports = sveMock;