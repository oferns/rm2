'use strict;'

function Register(cp) {
    if (cp === 'undefined' || cp === null) {
        throw new Error('cp is undefined');
    }

    if (!(this instanceof Register)) {
        return new Register(cp);
    }

    this.cp = cp;
};

Register.prototype.sanitize = function () {
    return function (req, res, next) {
        req.body.register = req.body.register || {};
        req.sanitizeBody('register[name]').stripLow();
        req.sanitizeBody('register[email]').normalizeEmail();
        req.sanitizeBody('register[password]').stripLow();
        req.sanitizeBody('register[repassword]').stripLow();
        return next();
    };
};

Register.prototype.validate = function () {
    return function (req, res, next) {

        if (req.body.register) {
            req.check('register[name]', 'An name is required.').notEmpty().withMessage('Please enter a valid name');
            req.check('register[email]', 'An email address is required.').notEmpty().isEmail().withMessage('Please enter a valid email address');
            req.check('register[password]', 'A password is required').notEmpty().isLength(6, 50).withMessage('Invalid password length. Should be between 6-50');
            req.check('register[repassword]', 'Passwords do not match').equals(req.body.register['password']);

            req.errors = req.validationErrors(true);
        } else {
            req.errors = { 'field': 'Missing post info' };
        }

        if (req.errors) {
            res.statusCode = 422;
        }

        res.locals.errors = req.errors ? req.errors : {};
        return next();
    };
};

Register.prototype.execute = function () {
    return function (req, res, next) {
        if (res.statusCode != 200) {
            return next();
        }

        return next();
    };
};

module.exports = Register;