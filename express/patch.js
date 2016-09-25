'use strict';


var Patch = function () {
    if (!(this instanceof Patch)) {
        return new Patch();
    }
};



Patch.prototype.render = function (app) {

    var _render = app.render;
    
    return function (view, locals, done) {
        if (locals._locals && locals._locals.xhr) {
            view = view.split('/');
            var viewname = view.pop();
            view.push('partials/_' + viewname);
            view = view.join('/');
        }
        _render.apply(app, [view, locals, done]);
    };
};

Patch.prototype.setXhr = function (req, res, next) {
    res.locals.xhr = req.xhr;
    return next();
};

module.exports = Patch;
