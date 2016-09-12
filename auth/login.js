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

Login.prototype.sanitize = function () {
    return function (req, res, next) {
        req.body.login = req.body.login || {};
        req.body.login['email'] = req.body.login['email'] || '';
        req.sanitizeBody('login[email]').normalizeEmail();
        return next();
    };
};

Login.prototype.validate = function () {
    return function (req, res, next) {

        req.check('login[email]', 'An email address is required.').notEmpty().isEmail().withMessage('Email is not valid');
        req.check('login[password]', 'A password is required').notEmpty().isLength(6, 50).withMessage('Invalid password length. Should be between 6-50');

        req.errors = req.validationErrors(true);

        if (req.errors) {
            res.statusCode = 422;
        }

        res.locals.errors = req.errors || {};
        return next();
    };
};

Login.prototype.execute = function () {
    return function (req, res, next) {
        if (res.statusCode != 200) {
            return next();
        }

        

        return next();
    };
};

module.exports = Login;
