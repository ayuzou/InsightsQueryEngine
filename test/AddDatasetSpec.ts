/**
 * Unit tests for addDataset() defined in IInsightFacade.ts
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */

import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import PersistenceLayer from "../src/controller/PersistenceLayer";

describe("addDataset()", function () {

    const fs: any = require('fs');
    const path: any = require('path');
    const DIR_PATH: string = path.join(__dirname, 'data/');
    const courses_cache: string = fs.readFileSync(DIR_PATH + 'courses.zip', 'base64');

    function sanityCheck(response: InsightResponse): void {
        expect(response).to.not.be.null;
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    function readZipFileSync(fileName: string): string {
        if (fileName === 'courses') {
            return courses_cache;
        }
        const filePath: string = DIR_PATH + fileName + '.zip';
        return fs.readFileSync(filePath, 'base64');
    }

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
        PersistenceLayer.getInstance().clearAll();
    });


    describe("should return a response with code 201 and a valid body", function () {

        before(function (done) {
            PersistenceLayer.getInstance().create('courses', [{}, {}]).then(function () {
                done();
            });
        });

        it("given both a valid existing id and a valid content", function () {
            this.timeout(4000);
            return new InsightFacade()
                .addDataset('courses', readZipFileSync('courses'))
                .then(function (response: InsightResponse) {
                    sanityCheck(response);
                    expect(response.code).to.equal(201);
                })
                .catch(function(error: any) {
                    Log.test('Error:' + error);
                    expect.fail();
                });
        });

    });

    describe("should return a response with code 204 and a valid body", function () {

        it("given both a valid new id and a valid content", function () {
            this.timeout(5000);
            const content: string = readZipFileSync('courses');
            return new InsightFacade()
                .addDataset('courses', content)
                .then(function (response: InsightResponse) {
                    sanityCheck(response);
                    expect(response.code).to.equal(204);
                })
                .catch(function (error: any) {
                    Log.test("Error: " + error);
                    expect.fail();
                });
        });

        it("given both a valid new id and one valid content", function () {
            return new InsightFacade()
                .addDataset('courses', readZipFileSync('onlyonevalidcontent'))
                .then(function (response: InsightResponse) {
                    sanityCheck(response);
                    expect(response.code).to.equal(204);
                })
                .catch(function (error: any) {
                    Log.test("Error: " + error);
                    expect.fail();
                });
        });

    });

    describe("should return a response with code 400 and a body containing error message", function () {

        describe("Mock Phoenix", function () {
            before(function (done) {
                PersistenceLayer.getInstance().create('courses', [{}, {}]).then(function () {
                    done();
                });
            });

            it("given both a valid existing id and a empty content", function () {
                this.timeout(4000);
                return new InsightFacade()
                    .addDataset('courses', readZipFileSync('emptydata'))
                    .then(function (response: InsightResponse) {
                        Log.test('Error: should not fulfill: ' + response);
                        expect.fail();
                    })
                    .catch(function(error: any) {
                        Log.test("Get expected error: " + error.body.error);
                        expect(error.code).to.equal(400);
                    });
            });
        });

        it("given an invalid id", function () {
            return new InsightFacade()
                .addDataset('invalidid', readZipFileSync('courses'))
                .then(function (response: InsightResponse) {
                    Log.test('Error: should not fulfill: ' + response);
                    expect.fail();
                })
                .catch(function (error: any) {
                    Log.test("Get expected error: " + error.body.error);
                    expect(error.code).to.equal(400);
                });
        });

        it("given a content which is a bad zip file", function () {
            return new InsightFacade()
                .addDataset('courses', readZipFileSync('notazip'))
                .then(function (response: InsightResponse) {
                    Log.test('Error: should not fulfill: ' + response);
                    expect.fail();
                })
                .catch(function (error: any) {
                    Log.test("Get expected error: " + error.body.error);
                    expect(error.code).to.equal(400);
                });
        });

        it("given a content without any valid course section", function () {
            return new InsightFacade()
                .addDataset('courses', readZipFileSync('emptydata'))
                .then(function (response: InsightResponse) {
                    Log.test('Error: should not fulfill: ' + response);
                    expect.fail();
                })
                .catch(function (error: any) {
                    Log.test("Get expected error: " + error.body.error);
                    expect(error.code).to.equal(400);
                });
        });

        it("given a content without any valid course section", function () {
            return new InsightFacade()
                .addDataset('courses', readZipFileSync('novalid'))
                .then(function (response: InsightResponse) {
                    Log.test('Error: should not fulfill: ' + response);
                    expect.fail();
                })
                .catch(function (error: any) {
                    Log.test("Get expected error: " + error.body.error);
                    expect(error.code).to.equal(400);
                });
        });

        it("given a zip file which only has an empty folder", function () {
            return new InsightFacade()
                .addDataset('courses', readZipFileSync('emptyfolder'))
                .then(function (response: InsightResponse) {
                    Log.test('Error: should not fulfill: ' + response);
                    expect.fail();
                })
                .catch(function (error: any) {
                    Log.test("Get expected error: " + error.body.error);
                    expect(error.code).to.equal(400);
                });
        });

        it("given a zip file which has an empty file inside a folder", function () {
            return new InsightFacade()
                .addDataset('courses', readZipFileSync('emptyfile'))
                .then(function (response: InsightResponse) {
                    Log.test('Error: should not fulfill: ' + response);
                    expect.fail();
                })
                .catch(function (error: any) {
                    Log.test("Get expected error: " + error.body.error);
                    expect(error.code).to.equal(400);
                });
        });

    });

});