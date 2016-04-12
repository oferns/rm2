'use strict';

var assert = require('assert');
var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);

var should = chai.should();
var expect = chai.expect;


describe('index', function(){
    
    var routes = require('../routes/index')();
    var res = {'render': function(view){ return view} };
    
    describe('/', function(done){
               
        var renderSpy = chai.spy.on(res, 'render');
            
        
    })    
});
