'use strict';


var chai = require('chai');
var spies = require('chai-spies');
var sinon = require('sinon');
var assert = chai.assert;

chai.use(spies);

var should = chai.should();
var expect = chai.expect;


var patch = require('./patch');


describe('patch', function () {

    describe('CTor', function () {
        it('should return the patch object', function () {
            expect(patch()).to.be.instanceof(patch);
        })
    });

    describe('render', function () {

        it('should return a function with three arguments', function () {
            var func = patch().render({});
            assert((typeof (func) == 'function'), "Does not return a function");
            assert(func.length == 3, "Wrong number of argumnents, there should be 3");
        });

        it('should not alter the view if xhr is false', function (done) {
            var app = {
                render: function (view, locals, cb) { return cb(null, view) }
            };

            var func = patch().render(app);
            var view = 'testview';
            var result = func(view, {}, function (err, result) {
                expect(result).to.equal(view);
                done();
            })
        });

        it('should alter the view if xhr is true', function (done) {
            var app = {
                render: function (view, locals, cb) { return cb(null, view) }
            };

            var func = patch().render(app);
            var view = 'testview';
            var result = func(view, { _locals: { xhr: true } }, function (err, result) {
                expect(result).to.equal('partials/_' + view);
                done();
            })
        });
    });

    describe('setXhr', function () {
        it('should set the locals.xhr to the req.xhr', function () {
            var req = {
                xhr: true
            };

            var res = {
                locals: {}
            }

            patch().setXhr(req, res, function (err) {
                expect(res.locals.xhr).to.equal(req.xhr);
            })
        });
    });
});