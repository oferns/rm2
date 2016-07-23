'option strict';

var router = require('express').Router({ 'mergeParams': true, 'strict': true });

module.exports = function (register) {

    router.route('/register')
        .get(function (req, res, next) {
            return res.render('auth/register',{ 'errors': req.errors || {}, 'register': {} });
        })
        .post(register.sanitize, register.validate, register.execute, function (req, res, next) {
            console.log(res.statusCode);
            switch (res.statusCode) {
                case 200: return res.redirect('/thank-you');
                case 422: return res.render('auth/register');
                default: return next();
            }
        });
 

    return router;

}