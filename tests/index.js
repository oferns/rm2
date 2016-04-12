'use strict';

var express = require('express');
var request = require('supertest');
var path = require('path'); // For resolving paths

var assert = require('assert');
var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);

var should = chai.should();
var expect = chai.expect;


describe('index', function(){
    
    var router = require('../routes/index')();

    describe('/', function(){
            var app = express();
            app.use(router);          
            app.set('views', path.join(process.env.localProjectDir || __dirname, '../views'));
            app.set('view engine', 'jade');
           
           it('should return 200 on the homepage for anonymous user', function(done){
                           
            request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200)
                .end(function(err, result){
                    if(err){
                        return done(err);
                    }                   
                    return done(null, result);
                })                              
           })    
            
        
    })    
});
