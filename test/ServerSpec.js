"use strict";
var Server_1 = require("../src/rest/Server");
var chai_1 = require("chai");
var chai = require("chai");
var chaiHttp = require("chai-http");
var Endpoint_1 = require("../src/rest/Endpoint");
describe("Server", function () {
    it("should be able to create a server", function () {
        var server = new Server_1.default(1234);
        server.start().then(function (result) {
            chai_1.expect(result).to.equal(true);
            server.stop().then(function (result) {
                chai_1.expect(result).to.equal(true);
            }).catch(function (err) {
                chai_1.expect.fail();
            });
        }).catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("Test Server", function () {
        chai.use(chaiHttp);
        var server = new Server_1.default(4321);
        var URL = "http://127.0.0.1:4321";
        chai_1.expect(server).to.not.equal(undefined);
        try {
            Endpoint_1.default.echo({}, null, null);
            chai_1.expect.fail();
        }
        catch (err) {
            chai_1.expect(err.message).to.equal("Cannot read property 'json' of null");
        }
        return server.start().then(function (success) {
            return chai.request(URL)
                .get("/");
        }).catch(function (err) {
            chai_1.expect.fail();
        }).then(function (res) {
            chai_1.expect(res.status).to.be.equal(200);
            return chai.request(URL)
                .get("/echo/Hello");
        }).catch(function (err) {
            chai_1.expect.fail();
        }).then(function (res) {
            chai_1.expect(res.status).to.be.equal(200);
            return server.start();
        }).then(function (success) {
            chai_1.expect.fail();
        }).catch(function (err) {
            chai_1.expect(err.code).to.equal('EADDRINUSE');
            return server.stop();
        }).catch(function (err) {
            chai_1.expect.fail();
        });
    });
});
//# sourceMappingURL=ServerSpec.js.map