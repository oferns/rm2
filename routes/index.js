'option strict';

var router = require('express').Router();

module.exports = function() {


    router.route('/')
        .get(function(req, res, next) {
            return res.render('home');
        })
        

    router.route('/style')
        .get(function(req, res, next) {
            return res.render('style');
        })
       
    return router;
}