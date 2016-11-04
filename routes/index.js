'option strict';

var router = require('express').Router({ 'mergeParams': true, 'strict': true });

module.exports = function(cp) {
     
    var authRoutes = require('./auth/index')(cp); 
    
    router.route('/')
        .get(function(req, res, next) {
            return res.render('home');
        });

    router.route('/contact')
        .get(function(req, res, next) {
            return res.render('contact');
        });
        
    router.route('/error')
        .get(function(req, res, next) {                        
            return next(new Error('This is a test error'));
        });
          
    router.use('/', authRoutes);

    return router;
}