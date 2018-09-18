"use strict";
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var PersistenceLayer_1 = require("../src/controller/PersistenceLayer");
describe("addDataset()", function () {
    var fs = require('fs');
    var path = require('path');
    var DIR_PATH = path.join(__dirname, 'data/');
    var rooms_cache = fs.readFileSync(DIR_PATH + 'rooms.zip', 'base64');
    function sanityCheck(response) {
        chai_1.expect(response).to.not.be.null;
        chai_1.expect(response).to.have.property('code');
        chai_1.expect(response).to.have.property('body');
        chai_1.expect(response.code).to.be.a('number');
    }
    function readZipFileSync(fileName) {
        if (fileName === 'rooms') {
            return rooms_cache;
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
    describe("should return a response with code 204 and a valid body", function () {
        it("given both a valid new id and a valid content", function () {
            this.timeout(4000);
            return new InsightFacade_1.default()
                .addDataset('rooms', readZipFileSync('rooms'))
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
});
//# sourceMappingURL=AddRoomsDatasetSpec.js.map