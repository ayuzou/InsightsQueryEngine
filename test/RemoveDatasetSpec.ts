/**
 * Unit tests for removeDataset() defined in IInsightFacade.ts
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */

import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import PersistenceLayer from "../src/controller/PersistenceLayer";

describe("removeDataset()", function () {

    function sanityCheck(response: InsightResponse): void {
        expect(response).to.not.be.null;
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        PersistenceLayer.getInstance().clearAll();
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });


    describe("should return a response with code 204 and a valid body", function () {

        before(function (done) {
            PersistenceLayer.getInstance().create('courses', [{}, {}]).then(function () {
                done();
            });
        });

        it("given both a valid existing id and a valid content", function () {
            return new InsightFacade()
                .removeDataset('courses')
                .then(function (response: InsightResponse) {
                    sanityCheck(response);
                    expect(response.code).to.equal(204);
                })
                .catch(function(error: any) {
                    Log.test('Error:' + error);
                    expect.fail();
                });
        });

    });

    describe("should return a response with code 404 and a valid body", function () {

        it("given an invalid id and a valid content", function () {
            this.timeout(4000);
            return new InsightFacade()
                .removeDataset('hello')
                .then(function (response: InsightResponse) {
                    Log.test('Error: should not fulfill: ' + response);
                    expect.fail();
                })
                .catch(function(error: any) {
                    Log.test('Get expected error:' + error.body.error);
                    expect(error.code).to.equal(404);
                });
        });

    });
});