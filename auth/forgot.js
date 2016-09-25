'use strict;'

function Forgot(cp) {
  if (cp === 'undefined' || cp === null) {
        throw new Error('cp is undefined');
    }

    if (!(this instanceof Forgot)) {
        return new Forgot(cp);
    }

    this.cp = cp;
}



Forgot.prototype.sanitize = function(){
    return function(req, res, next){
        
        return next();
    };
};

module.exports = Forgot;
