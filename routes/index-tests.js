'use strict';

var express = require('express');
var request = require('supertest');
var path = require('path'); // For resolving paths
var app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');


var assert = require('assert');
var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);

var should = chai.should();
var expect = chai.expect;


describe('index', function() {

    var router = require('../routes/index')();
    app.use(router);

    describe('/', function() {

        it('should return 200 on the homepage for anonymous user', function(done) {

            request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200)
                .end(function(err, response) {
                    if (err) {
                        return done(err);
                    }
                    return done(null, response);
                })
        })
    });

    describe('/style', function() {

        it('should return 200 on the stylepage for anonymous user', function(done) {

            request(app)
                .get('/style')
                .expect('Content-Type', /html/)
                .expect(200)
                .end(function(err, response) {
                    if (err) {
                        return done(err);
                    }
                    return done(null, response);
                })
        })
    });



    describe('/register', function() {
        it('should return 200 on the register page for anonymous user', function(done) {
            request(app)
                .get('/register')
                .expect('Content-Type', /html/)
                .expect(200)
                .end(function(err, response) {
                    if (err) {
                        return done(err);
                    }
                    return done(null, response);
                })
        })
    });
});