"use strict";
var Server_1 = require("../src/rest/Server");
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var chaiHttp = require("chai-http");
var chai = require("chai");
describe("EchoSpec", function () {
    var fs = require('fs');
    var path = require('path');
    var DIR_PATH = path.join(__dirname, 'data/');
    var courses_cache = fs.readFileSync(DIR_PATH + 'courses.zip', 'base64');
    function sanityCheck(response) {
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
    });
    afterEach(function () {
        Util_1.default.test('AfterTest: ' + this.currentTest.title);
    });
    function readZipFileSync(fileName) {
        var filePath = DIR_PATH + fileName + '.zip';
        return fs.readFileSync(filePath);
    }
    it("PUT description", function () {
        chai.use(chaiHttp);
        var server = new Server_1.default(4321);
        var URL = "http://127.0.0.1:4321";
        return server.start().then(function (success) {
            return chai.request(URL)
                .put('/dataset/courses')
                .attach('body', readZipFileSync('courses'), 'courses')
                .then(function (res) {
                Util_1.default.trace('then:');
            })
                .catch(function (err) {
                Util_1.default.trace('catch:');
                chai_1.expect.fail();
            });
        }).catch(function (err) {
            chai_1.expect.fail();
        });
    });
});
//# sourceMappingURL=EndpointSpec.js.map