"use strict";
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var PersistenceLayer_1 = require("../src/controller/PersistenceLayer");
describe("removeDataset()", function () {
    function sanityCheck(response) {
        chai_1.expect(response).to.not.be.null;
        chai_1.expect(response).to.have.property('code');
        chai_1.expect(response).to.have.property('body');
        chai_1.expect(response.code).to.be.a('number');
    }
    before(function () {
        Util_1.default.test('Before: ' + this.test.parent.title);
    });
    beforeEach(function () {
        Util_1.default.test('BeforeTest: ' + this.currentTest.title);
    });
    after(function () {
        Util_1.default.test('After: ' + this.test.parent.title);
        PersistenceLayer_1.default.getInstance().clearAll();
    });
    afterEach(function () {
        Util_1.default.test('AfterTest: ' + this.currentTest.title);
    });
    describe("should return a response with code 204 and a valid body", function () {
        before(function (done) {
            PersistenceLayer_1.default.getInstance().create('courses', [{}, {}]).then(function () {
                done();
            });
        });
        it("given both a valid existing id and a valid content", function () {
            return new InsightFacade_1.default()
                .removeDataset('courses')
                .then(function (response) {
                sanityCheck(response);
                chai_1.expect(response.code).to.equal(204);
            })
                .catch(function (error) {
                Util_1.default.test('Error:' + error);
                chai_1.expect.fail();
            });
        });
    });
    describe("should return a response with code 404 and a valid body", function () {
        it("given an invalid id and a valid content", function () {
            this.timeout(4000);
            return new InsightFacade_1.default()
                .removeDataset('hello')
                .then(function (response) {
                Util_1.default.test('Error: should not fulfill: ' + response);
                chai_1.expect.fail();
            })
                .catch(function (error) {
                Util_1.default.test('Get expected error:' + error.body.error);
                chai_1.expect(error.code).to.equal(404);
            });
        });
    });
});
//# sourceMappingURL=RemoveDatasetSpec.js.map