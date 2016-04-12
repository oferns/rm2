'use strict;'

function Login(cp) {
    if (cp === 'undefined' || cp === null) {
        throw new Error('cp is undefined');
    }

    if (!(this instanceof Login)) {
        return new Login(cp);
    }
    
    this.cp = cp;
}

Login.prototype.sanitize = function(req, res, next) {
    req.sanitizeBody('login[email]').normalizeEmail();
    return next();
};


Login.prototype.validate = function(req, res, next) {

    req.checkBody('login[email]', 'An email address is required.').notEmpty().isEmail().withMessage('Email is not valid');
    req.checkBody('login[password]', 'A password is required').notEmpty().isLength(6, 50).withMessage('Invalid password length. Should be between 6-50');

};

Login.prototype.execute = function(req, res, next) {

};

module.exports = Login;
