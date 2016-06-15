'option strict';

var router = require('express').Router({ 'mergeParams': true, 'strict': true });

module.exports = function(cp) {

    var login = require('../../app/auth/login')(cp);
    var loginRoutes = require('./login')(login);
    router.use('/', loginRoutes);        


    var register = require('../../app/auth/register')(cp);
    var registerRoutes = require('./register')(register);
    router.use('/', registerRoutes);        

   return router;
}