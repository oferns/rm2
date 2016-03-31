'option strict';

var router = require('express').Router();

module.exports = function() {


    router.route('/')
        .get(function(req, res, next) {
            return res.render('home');
        })

    return router;
}