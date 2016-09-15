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

    var res = {
        render: function () { }
    };

    describe('notFound', function () {

        it('should set the res.statusCode to 404', function () {
            errorHandlers.notFound({}, res);
            assert(res.statusCode == 404, 'Incorrect status code')
        });

        it('should call res.render with 404', function () {
            var renderSpy = chai.spy.on(res.render);
            errorHandlers.notFound({}, res);
            expect(renderSpy).to.have.been.called.exactly.once;
        });
    });

    describe('serverError', function () {
        it('should set the statusCode to 500 if it is not set', function () {
            errorHandlers.serverError({}, {}, res);
            assert(res.statusCode == 500, 'Incorrect status code');
        });

        it('should set the err.status to 500 if it is not set', function () {
            var err = {};
            errorHandlers.serverError(err, {}, res);
            assert(err.status == 500, 'Incorrect status code');
        });

        it('should persist the err.status if it is set', function () {
            var err = { status: 599 };
            errorHandlers.serverError(err, {}, res);
            assert(err.status == 599, 'Incorrect status code');
        });

        it('should call res.render on the 500 page with the err object ', function () {
            var renderSpy = chai.spy.on(res.render);
            var err = {};
            errorHandlers.serverError(err, {}, res);
            expect(renderSpy).to.have.been.called.exactly.once;
        });
    });
});