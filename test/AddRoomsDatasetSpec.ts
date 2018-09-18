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
    const rooms_cache: string = fs.readFileSync(DIR_PATH + 'rooms.zip', 'base64');

    function sanityCheck(response: InsightResponse): void {
        expect(response).to.not.be.null;
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    function readZipFileSync(fileName: string): string {
        if (fileName === 'rooms') {
            return rooms_cache;
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

    describe("should return a response with code 204 and a valid body", function () {

        it("given both a valid new id and a valid content", function () {
            this.timeout(4000);
            return new InsightFacade()
                .addDataset('rooms', readZipFileSync('rooms'))
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
});