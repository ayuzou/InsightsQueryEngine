"use strict";
var Util_1 = require("../Util");
var ZipFileReader_1 = require("./ZipFileReader");
var CourseRecordFilter_1 = require("./courses/CourseRecordFilter");
var PersistenceLayer_1 = require("./PersistenceLayer");
var InsightsQuery_1 = require("./language/InsightsQuery");
var InsightFacade = (function () {
    function InsightFacade() {
        Util_1.default.trace('InsightFacadeImpl::init()');
    }
    InsightFacade.prototype.addDataset = function (id, content) {
        return new Promise(function (fulfill, reject) {
            if (id === InsightFacade.COURSES) {
                new ZipFileReader_1.default().readCoursesZip(content)
                    .then(function (results) {
                    var recs = CourseRecordFilter_1.default.filter(results);
                    InsightFacade.addData(id, recs).then(function (resp) {
                        fulfill(resp);
                    }).catch(function (errResp) {
                        reject(errResp);
                    });
                })
                    .catch(function () {
                    Util_1.default.error('Bad courses zip file. Fulfill response with 400.');
                    reject({
                        code: 400,
                        body: { error: 'Error parsing the courses zip file' }
                    });
                });
            }
            else if (id === InsightFacade.ROOMS) {
                new ZipFileReader_1.default().readRoomsZip(content)
                    .then(function (rooms) {
                    InsightFacade.addData(id, rooms).then(function (resp) {
                        fulfill(resp);
                    }).catch(function (errResp) {
                        reject(errResp);
                    });
                })
                    .catch(function () {
                    reject({
                        code: 400,
                        body: { error: 'Error parsing the rooms zip file' }
                    });
                });
            }
            else {
                reject({
                    code: 400,
                    body: { error: 'invalid id' }
                });
            }
        });
    };
    InsightFacade.addData = function (id, data) {
        return new Promise(function (fulfill, reject) {
            if (data.length === 0) {
                reject({
                    code: 400,
                    body: { error: 'No valid data found in content.' }
                });
            }
            else {
                var pl = PersistenceLayer_1.default.getInstance();
                if (pl.hasDataset(id)) {
                    pl.update(id, data).then(function () {
                        fulfill({
                            code: 201,
                            body: { message: 'Successfully replace an existing data set.' }
                        });
                    });
                }
                else {
                    pl.create(id, data).then(function () {
                        fulfill({
                            code: 204,
                            body: { message: 'Successfully added a new data set.' }
                        });
                    });
                }
            }
        });
    };
    InsightFacade.prototype.removeDataset = function (id) {
        return new Promise(function (fulfill, reject) {
            var pl = PersistenceLayer_1.default.getInstance();
            if (pl.hasDataset(id)) {
                pl.remove(id).then(function () {
                    fulfill({
                        code: 204,
                        body: { message: 'Successfully removed data set: ' + id }
                    });
                });
            }
            else {
                reject({
                    code: 404,
                    body: { error: 'Data set does not exist: ' + id }
                });
            }
        });
    };
    InsightFacade.prototype.performQuery = function (query) {
        return new Promise(function (fulfill, reject) {
            var insightsQuery = null;
            try {
                insightsQuery = InsightsQuery_1.default.parse(query);
            }
            catch (err) {
                reject({
                    code: 400,
                    body: { error: 'Query parsing error: ' + err }
                });
            }
            if (insightsQuery !== null) {
                var id = insightsQuery.getIsCoursesQuery() ?
                    InsightFacade.COURSES : InsightFacade.ROOMS;
                var pl = PersistenceLayer_1.default.getInstance();
                if (pl.hasDataset(id)) {
                    var data = pl.loadDataset(id);
                    var result = insightsQuery.interp(data);
                    fulfill({
                        code: 200,
                        body: { result: result }
                    });
                }
                else {
                    Util_1.default.warn('Dataset: ' + id + ' not found, return 424.');
                    reject({
                        code: 424,
                        body: { error: 'Query failed because of missing data set.' }
                    });
                }
            }
        });
    };
    return InsightFacade;
}());
InsightFacade.COURSES = 'courses';
InsightFacade.ROOMS = 'rooms';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InsightFacade;
//# sourceMappingURL=InsightFacade.js.map