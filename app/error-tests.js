'option strict';

var chai = require('chai');
var spies = require('chai-spies');
var should = chai.should();
var assert = chai.assert;
var sinon = require('sinon');

chai.use(spies);

var should = chai.should();
var expect = chai.expect;

var errorHandlers = require('./error');


describe('errors', function () {
    describe('notFound', function () {
        var res = {
            render: function () { }
        };

        it('should set the res.statusCode to 404', function () {
            var req = {};
            errorHandlers.notFound(req, res);
            assert(res.statusCode == 404, 'Incorrect status code')
        });

        it('should call res.render with 404', function () {
            var req = {};
            var renderSpy = chai.spy.on(res.render);
            errorHandlers.notFound(req, res);
            expect(renderSpy).to.have.been.called.exactly.once;
        });
    });

    describe('serverError', function () {
        it('should set the statusCode to 500 if it is not set', function () {

        });

        it('should set the err.status to 500 if it is not set', function () {

        });

        it('should persist the statusCode if it is set', function () {

        });

        it('should call res.render on the 500 page with the err object ', function () {

        });

    })
});