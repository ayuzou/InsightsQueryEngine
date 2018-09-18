"use strict";
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var PersistenceLayer_1 = require("../src/controller/PersistenceLayer");
describe("addDataset()", function () {
    var fs = require('fs');
    var path = require('path');
    var DIR_PATH = path.join(__dirname, 'data/');
    var courses_cache = fs.readFileSync(DIR_PATH + 'courses.zip', 'base64');
    function sanityCheck(response) {
        chai_1.expect(response).to.not.be.null;
        chai_1.expect(response).to.have.property('code');
        chai_1.expect(response).to.have.property('body');
        chai_1.expect(response.code).to.be.a('number');
    }
    function readZipFileSync(fileName) {
        if (fileName === 'courses') {
            return courses_cache;
        }
        var filePath = DIR_PATH + fileName + '.zip';
        return fs.readFileSync(filePath, 'base64');
    }
    before(function () {
        Util_1.default.test('Before: ' + this.test.parent.title);
    });
    beforeEach(function () {
        Util_1.default.test('BeforeTest: ' + this.currentTest.title);
    });
    after(function () {
        Util_1.default.test('After: ' + this.test.parent.title);
    });
    afterEach(function () {
        Util_1.default.test('AfterTest: ' + this.currentTest.title);
        PersistenceLayer_1.default.getInstance().clearAll();
    });
    describe("should return a response with code 201 and a valid body", function () {
        before(function (done) {
            PersistenceLayer_1.default.getInstance().create('courses', [{}, {}]).then(function () {
                done();
            });
        });
        it("given both a valid existing id and a valid content", function () {
            this.timeout(4000);
            return new InsightFacade_1.default()
                .addDataset('courses', readZipFileSync('courses'))
                .then(function (response) {
                sanityCheck(response);
                chai_1.expect(response.code).to.equal(201);
            })
                .catch(function (error) {
                Util_1.default.test('Error:' + error);
                chai_1.expect.fail();
            });
        });
    });
    describe("should return a response with code 204 and a valid body", function () {
        it("given both a valid new id and a valid content", function () {
            this.timeout(5000);
            var content = readZipFileSync('courses');
            return new InsightFacade_1.default()
                .addDataset('courses', content)
                .then(function (response) {
                sanityCheck(response);
                chai_1.expect(response.code).to.equal(204);
            })
                .catch(function (error) {
                Util_1.default.test("Error: " + error);
                chai_1.expect.fail();
            });
        });
        it("given both a valid new id and one valid content", function () {
            return new InsightFacade_1.default()
                .addDataset('courses', readZipFileSync('onlyonevalidcontent'))
                .then(function (response) {
                sanityCheck(response);
                chai_1.expect(response.code).to.equal(204);
            })
                .catch(function (error) {
                Util_1.default.test("Error: " + error);
                chai_1.expect.fail();
            });
        });
    });
    describe("should return a response with code 400 and a body containing error message", function () {
        describe("Mock Phoenix", function () {
            before(function (done) {
                PersistenceLayer_1.default.getInstance().create('courses', [{}, {}]).then(function () {
                    done();
                });
            });
            it("given both a valid existing id and a empty content", function () {
                this.timeout(4000);
                return new InsightFacade_1.default()
                    .addDataset('courses', readZipFileSync('emptydata'))
                    .then(function (response) {
                    Util_1.default.test('Error: should not fulfill: ' + response);
                    chai_1.expect.fail();
                })
                    .catch(function (error) {
                    Util_1.default.test("Get expected error: " + error.body.error);
                    chai_1.expect(error.code).to.equal(400);
                });
            });
        });
        it("given an invalid id", function () {
            return new InsightFacade_1.default()
                .addDataset('invalidid', readZipFileSync('courses'))
                .then(function (response) {
                Util_1.default.test('Error: should not fulfill: ' + response);
                chai_1.expect.fail();
            })
                .catch(function (error) {
                Util_1.default.test("Get expected error: " + error.body.error);
                chai_1.expect(error.code).to.equal(400);
            });
        });
        it("given a content which is a bad zip file", function () {
            return new InsightFacade_1.default()
                .addDataset('courses', readZipFileSync('notazip'))
                .then(function (response) {
                Util_1.default.test('Error: should not fulfill: ' + response);
                chai_1.expect.fail();
            })
                .catch(function (error) {
                Util_1.default.test("Get expected error: " + error.body.error);
                chai_1.expect(error.code).to.equal(400);
            });
        });
        it("given a content without any valid course section", function () {
            return new InsightFacade_1.default()
                .addDataset('courses', readZipFileSync('emptydata'))
                .then(function (response) {
                Util_1.default.test('Error: should not fulfill: ' + response);
                chai_1.expect.fail();
            })
                .catch(function (error) {
                Util_1.default.test("Get expected error: " + error.body.error);
                chai_1.expect(error.code).to.equal(400);
            });
        });
        it("given a content without any valid course section", function () {
            return new InsightFacade_1.default()
                .addDataset('courses', readZipFileSync('novalid'))
                .then(function (response) {
                Util_1.default.test('Error: should not fulfill: ' + response);
                chai_1.expect.fail();
            })
                .catch(function (error) {
                Util_1.default.test("Get expected error: " + error.body.error);
                chai_1.expect(error.code).to.equal(400);
            });
        });
        it("given a zip file which only has an empty folder", function () {
            return new InsightFacade_1.default()
                .addDataset('courses', readZipFileSync('emptyfolder'))
                .then(function (response) {
                Util_1.default.test('Error: should not fulfill: ' + response);
                chai_1.expect.fail();
            })
                .catch(function (error) {
                Util_1.default.test("Get expected error: " + error.body.error);
                chai_1.expect(error.code).to.equal(400);
            });
        });
        it("given a zip file which has an empty file inside a folder", function () {
            return new InsightFacade_1.default()
                .addDataset('courses', readZipFileSync('emptyfile'))
                .then(function (response) {
                Util_1.default.test('Error: should not fulfill: ' + response);
                chai_1.expect.fail();
            })
                .catch(function (error) {
                Util_1.default.test("Get expected error: " + error.body.error);
                chai_1.expect(error.code).to.equal(400);
            });
        });
    });
});
//# sourceMappingURL=AddDatasetSpec.js.map