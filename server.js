'use strict';

var app = require('./app');

var port = process.env.PORT || 3000;


process.on('uncaughtException', function(err) {
    console.error(err.stack);
    process.exit(1);

})


var server = app.listen(port, function() {
    var host = server.address().address;

    console.log('The Red Mouse is listening at http://%s:%s', host, port);
});


