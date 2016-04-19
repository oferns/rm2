'use strict';

var express = require('express');
var request = require('supertest');
var path = require('path');
var bodyParser = require('body-parser');
var validator = require('express-validator');

var app = express();

app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());

var assert = require('assert');
var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);

var should = chai.should();
var expect = chai.expect;

describe('index', function () {
    var login = require('../../app/auth/login')({});
    
    var loginMock = {
        sanitize : login.sanitize,
        validate : login.validate,  
        execute : function(req, res, next) { return next() } 
    };  

    var router = require('../../routes/auth/index')({});
    
    app.use(router);

    describe('/login', function () {
        it('should return 200 GETTING the login page', function (done) {
            request(app)
                .get('/login')
                .expect('Content-Type', /html/)
                .expect(200, done);
        });
        
        it('should return 302 when POSTING valid details', function(done){
           request(app)
                .post('/login')
                .field('login[email]', 'test@test.com')
                .field('login[password]', 'Th1s1s4V4l1dP4$$w0rd')
                .expect(302)
                .end(function (err, response) {
                    if (err) {
                        return done(err);
                    }
                    
                    return done(null, response);
                })
            
        }),
        
        it('should return 422 when POSTING empty values', function(done){            
           request(app)
                .post('/login')
                .expect('Content-Type', /html/)
                .expect(422)
                .end(function (err, response) {
                    if (err) {
                        return done(err);
                    }
                    
                    return done(null, response);
                })
        });
        
    });
});