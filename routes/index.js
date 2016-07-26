'option strict';

var router = require('express').Router({ 'mergeParams': true, 'strict': true });

var errorHandlers = require('../app/error');

module.exports = function(cp) {
     
    var authRoutes = require('./auth/index')(cp); 
    router.route('/')
        .get(function(req, res, next) {
            return res.render('home');
        });
        
    router.route('/error')
        .get(function(req, res, next) {                        
            return next(new Error('This is a test error'));
        });
        
    router.route('/style')
        .get(function(req, res, next) {
            return res.render('style/style');
        });
                
    router.use('/', authRoutes);

    router.use(errorHandlers.notFound, errorHandlers.serverError);

    return router;
}