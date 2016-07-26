'option strict';


module.exports = {

    notFound: function (req, res, next) {
        res.statusCode = 404;
        return res.render('404');
    },

    serverError: function (err, req, res, next) {
        res.statusCode = err.status = err.status || 500;
        return res.render('500', {
            error: err
        });
    }
}