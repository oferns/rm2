'use strict';

var u = require('util');
var crypto = require('crypto');

const alg = 'aes-256-cbc';


var Auth = function (authKey) {
    if (!(this instanceof Auth)) {
        return new Auth(authKey);
    }

    this.authKey = authKey;
};


Auth.prototype.encryptObject = function (object, callback) {

    try {
        var objstr = JSON.stringify(object);
        var objbuffer = new Buffer(objstr);
        var iv = new Buffer(crypto.randomBytes(16));
        var buffer = new Buffer(this.authKey, 'hex');
        var cipher = crypto.createCipheriv(alg, buffer, iv);
        var cryptedbuffer = [cipher.update(objbuffer)];
        cryptedbuffer.push(cipher.final());
        var crypted = Buffer.concat(cryptedbuffer);
        return callback(null, iv.toString('hex') + ':' + crypted.toString('hex'));
    }
    catch (ex) {
        return callback(ex);
    }
};

Auth.prototype.decryptObject = function (iv, encryptedObject, callback) {
    
    try {
        var buffer = new Buffer(this.authKey, 'hex');
        var ivbuff = new Buffer(iv, 'hex');
        var dcipher = crypto.createDecipheriv(alg, buffer, ivbuff); // Create the cipher using the password above and the IV

        var dcryptedBuffers = [dcipher.update(new Buffer(encryptedObject, 'hex'))];
        dcryptedBuffers.push(dcipher.final());
        var dcrypted = Buffer.concat(dcryptedBuffers).toString('ascii');
        var obj = JSON.parse(dcrypted);

        return callback(null, obj);
    }
    catch (ex) {
        return callback(ex);
    }
};

Auth.prototype.checkPassword = function (password, encryptedPassword, iterations, callback) {

};

module.exports = Auth;