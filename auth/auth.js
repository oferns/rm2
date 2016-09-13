'use strict';

var u = require('util');
var crypto = require('crypto');

const alg = 'aes-256-cbc';


var Auth = function (options) {
    if (!(this instanceof Auth)) {
        return new Auth(options);
    }

    this.authKey = options.authKey;
    this.maxsaltLength = Math.min(options.maxsaltLength, 30);
    this.minsaltLength = Math.max(options.minsaltLength, 5);
    this.maxiterations = Math.min(options.maxiterations, 15000);
    this.miniterations = Math.max(options.miniterations, 10);
    this.hashBytes = Math.min(options.hashBytes, 1280);
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

Auth.prototype.encryptPassword = function (password, callback) {
    if (typeof password != 'string' || !password.length) {
        return callback(new Error('password must be a string'));
    }

    // TODO: Move saltlength and iter range to options
    var saltLength = Math.floor(Math.random() * (this.maxsaltLength - this.minsaltLength + 1) + this.minsaltLength);
    var iterations = Math.floor(Math.random() * (this.maxiterations - this.miniterations + 1) + this.miniterationsthis);
    var bytes = this.hashBytes;

    crypto.randomBytes(saltLength, function (err, salt) {
        if (err) {
            return callback(err);
        }

        crypto.pbkdf2(password, salt, iterations, bytes, function (err, hash) {
            if (err) {
                return callback(err);
            }


            var passwordhash = new Buffer(hash.length + salt.length + 8);
            // include the size of the salt so that we can, during verification,
            // figure out how much of the hash is salt
            passwordhash.writeUInt32BE(salt.length, 0, true);
            // similarly, include the iteration count
            passwordhash.writeUInt32BE(iterations, 4, true);

            salt.copy(passwordhash, 8);
            hash.copy(passwordhash, salt.length + 8);
            return callback(null, passwordhash.toString('binary'));
        });
    });
};

Auth.prototype.verifyPassword = function (password, hash, callback) {
    try {
        var passwordhash = new Buffer(hash, 'binary')
        var saltBytes = passwordhash.readUInt32BE(0);
        var hashBytes = passwordhash.length - saltBytes - 8;
        var iterations = passwordhash.readUInt32BE(4);
        var salt = passwordhash.slice(8, saltBytes + 8);
        var hash = passwordhash.toString('binary', saltBytes + 8);

        // verify the salt and hash against the password
        crypto.pbkdf2(password, salt, iterations, hashBytes, function (err, verify) {
            if (err) {
                return callback(err, false);
            }

            return callback(null, verify.toString('binary') === hash);
        });
    } catch (ex) {
        return callback(ex, false);
    }
};

module.exports = Auth;