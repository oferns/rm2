'option strict';

var router = require('express').Router();

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
        
    return router;
}