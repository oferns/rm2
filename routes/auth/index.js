'option strict';

var router = require('express').Router({ 'mergeParams': true, 'strict': true });

module.exports = function (cp) {
    
    var login = require('../../app/auth/login')(cp);

    router.route('/login')
        .get(function (req, res, next) {
            return res.render('login', { 'errors': req.errors || {}, 'login': {} });
        })
        .post(login.sanitize, login.validate, login.execute, function (req, res, next) {
            switch(res.statusCode){
                case 200: return res.redirect('/');
                case 422: return res.render('login', { 'errors': req.errors, 'login': req.body.login || {} });
                default: return next();
            }
        });


    return router;

}