'option strict';

var router = require('express').Router({ 'mergeParams': true, 'strict': true });

module.exports = function() {


    router.route('/')
        .get(function(req, res, next) {
            return res.render('home');
        });
        

    router.route('/style')
        .get(function(req, res, next) {
            return res.render('style');
        });
        
    router.route('/login')
        .get(function(req, res, next){
            return res.render('login', {'errors' : {}, 'login':{} });            
        });
        
    router.route('/register')
        .get(function(req, res, next){
            return res.render('register', {'errors' : {}, 'register':{} });            
        });
        
        
    return router;
}