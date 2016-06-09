'option strict';

var router = require('express').Router({ 'mergeParams': true, 'strict': true });

module.exports = function (login) {
    
    router.route('/login')
        .get(function (req, res, next) {
            return res.render('login', { 'errors': req.errors || {}, 'login': {} });
        })
        .post(login.sanitize, login.validate, login.execute, function (req, res, next) {
            switch(res.statusCode){
                case 200: return res.redirect('/home');
                case 422: return res.render('login', { 'errors': req.errors, 'login': req.body.login });
                default: return next(new Error('Fuck knnows what went wrong there'));
            }
        });
        

    return router;

}