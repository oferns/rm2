'option strict';

var router = require('express').Router({ 'mergeParams': true, 'strict': true });

module.exports = function () {
    
    router.route('/account')
        .get(function (req, res, next) {
            return res.render('auth/account');
        });
 

    return router;
};