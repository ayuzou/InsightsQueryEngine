"use strict";
var Server_1 = require("../src/rest/Server");
var chai_1 = require("chai");
var chai = require("chai");
var chaiHttp = require("chai-http");
var Util_1 = require("../src/Util");
var PersistenceLayer_1 = require("../src/controller/PersistenceLayer");
describe("Rest endpoint", function () {
    var fs = require('fs');
    var pl = PersistenceLayer_1.default.getInstance();
    var port = 4321;
    var server = new Server_1.default(port);
    var url = 'http://127.0.0.1:' + port;
    function getFilePath(id) {
        return __dirname + '/data/' + id + '.zip';
    }
    afterEach(function () {
        pl.clearAll();
    });
    before(function (done) {
        pl.clearAll();
        chai.use(chaiHttp);
        server.start().then(function () {
            Util_1.default.info('start server on port:' + port);
            done();
        });
    });
    after(function (done) {
        server.stop().then(function () {
            done();
        });
    });
    describe("addDataset", function () {
        this.timeout(4000);
        it("should respond to /dataset/rooms", function () {
            var id = 'rooms';
            var filePath = getFilePath(id);
            return chai.request(url)
                .put('/dataset/' + id)
                .attach('body', fs.readFileSync(filePath), filePath)
                .then(function (res) {
                Util_1.default.info('successfully get the response!');
                chai_1.expect(res.status).to.equal(204);
            }).catch(function (err) {
                Util_1.default.error('err responding to request:' + err);
                chai_1.expect.fail();
            });
        });
        it("should respond to /dataset/courses", function () {
            var id = 'courses';
            var filePath = getFilePath(id);
            return chai.request(url)
                .put('/dataset/' + id)
                .attach('body', fs.readFileSync(filePath), filePath)
                .then(function (res) {
                Util_1.default.info('successfully get the response!');
                chai_1.expect(res.status).to.equal(204);
            }).catch(function (err) {
                Util_1.default.error('err responding to request:' + err);
                chai_1.expect.fail();
            });
        });
        it("should respond 400 to bad zip file /dataset/courses", function () {
            var id = 'courses';
            var filePath = getFilePath('notazip');
            return chai.request(url)
                .put('/dataset/' + id)
                .attach('body', fs.readFileSync(filePath), filePath)
                .then(function (res) {
                Util_1.default.info('get the wrong response!');
                chai_1.expect.fail();
            }).catch(function (err) {
                Util_1.default.error('err responding to request:' + err);
                chai_1.expect(err.status).to.equal(400);
            });
        });
    });
    describe("removeDataset", function () {
        it("should respond 404 when rooms dataset does not exist", function () {
            var id = 'rooms';
            return chai.request(url)
                .del('/dataset/' + id)
                .then(function () {
                Util_1.default.info('successfully get the response!');
                chai_1.expect.fail();
            })
                .catch(function (err) {
                Util_1.default.error('err responding to request: ' + err);
                chai_1.expect(err.status).to.equal(404);
            });
        });
        it("should respond 404 when rooms dataset does not exist", function () {
            var id = 'courses';
            return chai.request(url)
                .del('/dataset/' + id)
                .then(function () {
                Util_1.default.info('successfully get the response!');
                chai_1.expect.fail();
            })
                .catch(function (err) {
                Util_1.default.error('err responding to request:' + err);
                chai_1.expect(err.status).to.equal(404);
            });
        });
        describe("should remove rooms", function () {
            var id = 'rooms';
            var endpoint = '/dataset/' + id;
            before(function (done) {
                var filePath = getFilePath(id);
                this.timeout(4000);
                chai.request(url)
                    .put(endpoint)
                    .attach('body', fs.readFileSync(filePath), filePath)
                    .then(function () {
                    done();
                });
            });
            it("by calling the endpoint", function () {
                return chai.request(url)
                    .del(endpoint)
                    .then(function (res) {
                    Util_1.default.info('successfully get the response!');
                    chai_1.expect(res.status).to.equal(204);
                })
                    .catch(function (err) {
                    Util_1.default.error('err responding to request:' + err);
                    chai_1.expect.fail();
                });
            });
        });
        describe("should remove courses", function () {
            var id = 'courses';
            var endpoint = '/dataset/' + id;
            before(function (done) {
                var filePath = getFilePath(id);
                this.timeout(4000);
                chai.request(url)
                    .put(endpoint)
                    .attach('body', fs.readFileSync(filePath), filePath)
                    .then(function () {
                    done();
                });
            });
            it("by calling the endpoint", function () {
                return chai.request(url)
                    .del(endpoint)
                    .then(function (res) {
                    Util_1.default.info('successfully get the response!');
                    chai_1.expect(res.status).to.equal(204);
                })
                    .catch(function (err) {
                    Util_1.default.error('err responding to request:' + err);
                    chai_1.expect.fail();
                });
            });
        });
    });
    describe("performQuery endpoint", function () {
        describe("can perform rooms query", function () {
            before(function (done) {
                var id = 'rooms';
                var filePath = getFilePath(id);
                this.timeout(4000);
                chai.request(url)
                    .put('/dataset/' + id)
                    .attach('body', fs.readFileSync(filePath), filePath)
                    .then(function () {
                    Util_1.default.info('successfully added rooms');
                    done();
                });
            });
            it("should respond to performQuery request", function () {
                var query = {
                    "WHERE": {
                        "IS": {
                            "rooms_name": "DMP_*"
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_name"
                        ],
                        "ORDER": "rooms_name"
                    }
                };
                return chai.request(url)
                    .post('/query')
                    .send(query)
                    .then(function (res) {
                    Util_1.default.info('successfully get the response!');
                    chai_1.expect(res.status).to.equal(200);
                }).catch(function (err) {
                    Util_1.default.error('err responding to request:' + err);
                    chai_1.expect.fail();
                });
            });
        });
        describe("can perform courses query", function () {
            before(function (done) {
                var id = 'courses';
                var filePath = getFilePath(id);
                this.timeout(4000);
                chai.request(url)
                    .put('/dataset/' + id)
                    .attach('body', fs.readFileSync(filePath), filePath)
                    .then(function () {
                    Util_1.default.info('successfully added courses');
                    done();
                });
            });
            it("should respond to performQuery request", function () {
                var query = {
                    "WHERE": {
                        "GT": {
                            "courses_avg": 97
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": "courses_avg"
                    }
                };
                return chai.request(url)
                    .post('/query')
                    .send(query)
                    .then(function (res) {
                    Util_1.default.info('successfully get the response!');
                    chai_1.expect(res.status).to.equal(200);
                }).catch(function (err) {
                    Util_1.default.error('err responding to request:' + err);
                    chai_1.expect.fail();
                });
            });
            it("should respond 400 to invalid query in performQuery request", function () {
                var query = {
                    "WHERE": {
                        "OR": []
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": "invalid_key"
                    }
                };
                return chai.request(url)
                    .post('/query')
                    .send(query)
                    .then(function (res) {
                    Util_1.default.info('successfully get the response!');
                    chai_1.expect.fail();
                }).catch(function (err) {
                    Util_1.default.error('err responding to request:' + err);
                    chai_1.expect(err.status).to.equal(400);
                });
            });
        });
    });
});
//# sourceMappingURL=RestSpec.js.map