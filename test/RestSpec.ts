import Server from "../src/rest/Server";
import {expect} from 'chai';
import chai = require('chai');
import chaiHttp = require('chai-http');
import Log from "../src/Util";
import PersistenceLayer from "../src/controller/PersistenceLayer";

describe("Rest endpoint" , function () {

    const fs: any = require('fs');
    const pl: PersistenceLayer = PersistenceLayer.getInstance();
    const port: number = 4321;
    const server: Server = new Server(port);
    const url: string = 'http://127.0.0.1:' + port;

    function getFilePath(id: string): string {
        return __dirname + '/data/' + id + '.zip';
    }

    afterEach(function () {
        pl.clearAll();
    });

    before(function (done) {
        pl.clearAll();
        chai.use(chaiHttp);
        server.start().then(function () {
            Log.info('start server on port:' + port);
            done();
        });
    });

    after(function(done) {
        server.stop().then(function () {
            done();
        });
    });

    describe("addDataset", function () {
        this.timeout(4000);

        it("should respond to /dataset/rooms", function() {
            const id: string = 'rooms';
            const filePath: string = getFilePath(id);

            return chai.request(url)
                .put('/dataset/' + id)
                .attach('body', fs.readFileSync(filePath), filePath)
                .then(function (res: any) {
                    Log.info('successfully get the response!');
                    expect(res.status).to.equal(204);
                }).catch(function (err: any) {
                    Log.error('err responding to request:' + err);
                    expect.fail();
                });
        });

        it("should respond to /dataset/courses", function() {
            const id: string = 'courses';
            const filePath: string = getFilePath(id);

            return chai.request(url)
                .put('/dataset/' + id)
                .attach('body', fs.readFileSync(filePath), filePath)
                .then(function (res: any) {
                    Log.info('successfully get the response!');
                    expect(res.status).to.equal(204);
                }).catch(function (err: any) {
                    Log.error('err responding to request:' + err);
                    expect.fail();
                });
        });

        it("should respond 400 to bad zip file /dataset/courses", function() {
            const id: string = 'courses';
            const filePath: string = getFilePath('notazip');

            return chai.request(url)
                .put('/dataset/' + id)
                .attach('body', fs.readFileSync(filePath), filePath)
                .then(function (res: any) {
                    Log.info('get the wrong response!');
                    expect.fail();
                }).catch(function (err: any) {
                    Log.error('err responding to request:' + err);
                    expect(err.status).to.equal(400);
                });
        });

    });

    describe("removeDataset", function () {

        it("should respond 404 when rooms dataset does not exist", function () {
            const id: string = 'rooms';
            return chai.request(url)
                .del('/dataset/' + id)
                .then(function () {
                    Log.info('successfully get the response!');
                    expect.fail();
                })
                .catch(function (err: any) {
                    Log.error('err responding to request: ' + err);
                    expect(err.status).to.equal(404);
                });
        });

        it("should respond 404 when rooms dataset does not exist", function () {
            const id: string = 'courses';
            return chai.request(url)
                .del('/dataset/' + id)
                .then(function () {
                    Log.info('successfully get the response!');
                    expect.fail();
                })
                .catch(function (err: any) {
                    Log.error('err responding to request:' + err);
                    expect(err.status).to.equal(404);
                });
        });

        describe("should remove rooms", function () {
            const id: string = 'rooms';
            const endpoint: string = '/dataset/' + id;

            before(function (done) {
                const filePath: string = getFilePath(id);

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
                    .then(function (res: any) {
                        Log.info('successfully get the response!');
                        expect(res.status).to.equal(204);
                    })
                    .catch(function (err: any) {
                        Log.error('err responding to request:' + err);
                        expect.fail();
                    });
            });
        });

        describe("should remove courses", function () {
            const id: string = 'courses';
            const endpoint: string = '/dataset/' + id;

            before(function (done) {
                const filePath: string = getFilePath(id);

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
                    .then(function (res: any) {
                        Log.info('successfully get the response!');
                        expect(res.status).to.equal(204);
                    })
                    .catch(function (err: any) {
                        Log.error('err responding to request:' + err);
                        expect.fail();
                    });
            });
        });

    });

    describe("performQuery endpoint", function () {

        describe("can perform rooms query", function () {

            before(function (done) {
                const id: string = 'rooms';
                const filePath: string = getFilePath(id);
                this.timeout(4000);
                chai.request(url)
                    .put('/dataset/' + id)
                    .attach('body', fs.readFileSync(filePath), filePath)
                    .then(function () {
                        Log.info('successfully added rooms');
                        done();
                    });
            });

            it("should respond to performQuery request", function() {
                const query: any = {
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
                    .then(function (res: any) {
                        Log.info('successfully get the response!');
                        expect(res.status).to.equal(200);
                    }).catch(function (err: any) {
                        Log.error('err responding to request:' + err);
                        expect.fail();
                    });
            });
        });

        describe("can perform courses query", function () {

            before(function (done) {
                const id: string = 'courses';
                const filePath: string = getFilePath(id);
                this.timeout(4000);
                chai.request(url)
                    .put('/dataset/' + id)
                    .attach('body', fs.readFileSync(filePath), filePath)
                    .then(function () {
                        Log.info('successfully added courses');
                        done();
                    });
            });

            it("should respond to performQuery request", function() {
                const query: any = {
                    "WHERE":{
                        "GT":{
                            "courses_avg":97
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                };
                return chai.request(url)
                    .post('/query')
                    .send(query)
                    .then(function (res: any) {
                        Log.info('successfully get the response!');
                        expect(res.status).to.equal(200);
                    }).catch(function (err: any) {
                        Log.error('err responding to request:' + err);
                        expect.fail();
                    });
            });

            it("should respond 400 to invalid query in performQuery request", function() {
                const query: any = {
                    "WHERE":{
                        "OR": []
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": "invalid_key"
                    }
                };
                return chai.request(url)
                    .post('/query')
                    .send(query)
                    .then(function (res: any) {
                        Log.info('successfully get the response!');
                        expect.fail();
                    }).catch(function (err: any) {
                        Log.error('err responding to request:' + err);
                        expect(err.status).to.equal(400);
                    });
            });
        });
    });

});