'option strict';

var router = require('express').Router({ 'mergeParams': true, 'strict': true });

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
            return res.render('style');
        });
                
    router.route('/register')
        .get(function(req, res, next){
            return res.render('register', {'errors' : {}, 'register':{} });            
        });

    router.use('/', authRoutes);        
        
    return router;
}