
var sinon = require('sinon');


function sveMock(statusCode) {
    if (!(this instanceof sveMock)) {
        return new sveMock(statusCode);
    }
    this.statusCode = statusCode || 200;
}

sveMock.prototype.sanitize = function (req, res, next) { return next() };

sveMock.prototype.validate = function (req, res, next) { return next() };

sveMock.prototype.execute = function (req, res, next) {
    res.statusCode = this.statusCode;
    return next();
};


module.exports = sveMock;