// Provides WWW-Authenticate basic authentication

'use strict';


const base64regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

var basic = function () {

}


basic.prototype.decodeHeader = function (header, callback) {
    try {

        var headerparts = header.split(' ');

        var token;

        for (var x = 0; x < headerparts.length; x++) {
            if (base64regex.test(headerparts[x])) {
                token = headerparts[x];
                break;
            }
        }

        if (!token) {
            return callback(new Error('Could not parse header'));
        }

        var userpword = Buffer.from(token, 'base64');
        var parts = userpword.split(':');

        if (parts.length != 2) {
            return callback(new Error('Could not parse header'));
        }

        return callback(null, {
            email: parts[0],
            password: parts[1]
        });

    }
    catch (ex) {
        return callback(ex);
    }

}

basic.prototype.authenticate = function () {
    var _this = this;
    return function (req, res, next) {

    }

}


module.exports = basic;