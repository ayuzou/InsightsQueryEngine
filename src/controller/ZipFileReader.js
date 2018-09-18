"use strict";
var Util_1 = require("../Util");
var InsightHtmlParser_1 = require("./rooms/InsightHtmlParser");
var JSZip = require('jszip');
var parse5 = require('parse5');
var ZipFileReader = (function () {
    function ZipFileReader() {
    }
    ZipFileReader.prototype.readCoursesZip = function (content) {
        return new Promise(function (fulfill, reject) {
            JSZip.loadAsync(content, { base64: true })
                .then(function (zip) {
                var proms = [];
                zip.forEach(function (relativePath, file) {
                    if (!file.dir) {
                        proms.push(file.async('string')
                            .then(function (text) {
                            try {
                                return JSON.parse(text);
                            }
                            catch (err) {
                                Util_1.default.error('Error parsing single file text:' + err);
                                Util_1.default.error('Skip this file.');
                                return null;
                            }
                        }));
                    }
                });
                Promise.all(proms)
                    .then(function (results) {
                    var recs = [];
                    for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                        var rec = results_1[_i];
                        if (rec !== null) {
                            recs.push(rec);
                        }
                    }
                    fulfill(recs);
                })
                    .catch(function (err) {
                    reject(err);
                });
            })
                .catch(function (err) {
                Util_1.default.error('Error reading the initial zip file: ' + err);
                reject('Bad courses zip file.');
            });
        });
    };
    ZipFileReader.prototype.readRoomsZip = function (content) {
        return new Promise(function (fulfill, reject) {
            JSZip.loadAsync(content, { base64: true })
                .then(function (zip) {
                ZipFileReader.getBuildingsListFromIndex(zip)
                    .then(function (buildings) {
                    var proms = [];
                    var _loop_1 = function (building) {
                        var shortname = building.getShortName();
                        var filePath = 'campus/discover/buildings-and-classrooms/' + shortname;
                        var file = zip.file(filePath);
                        proms.push(file.async('string').then(function (result) {
                            return {
                                building: building,
                                document: parse5.parse(result)
                            };
                        }));
                    };
                    for (var _i = 0, buildings_1 = buildings; _i < buildings_1.length; _i++) {
                        var building = buildings_1[_i];
                        _loop_1(building);
                    }
                    Promise.all(proms).then(function (results) {
                        var lst = [];
                        for (var _i = 0, results_2 = results; _i < results_2.length; _i++) {
                            var result = results_2[_i];
                            var rms = InsightHtmlParser_1.default.getRoomsOfBuilding(result.building, result.document);
                            for (var _a = 0, rms_1 = rms; _a < rms_1.length; _a++) {
                                var rm = rms_1[_a];
                                lst.push(rm.createRoomRecord());
                            }
                        }
                        fulfill(lst);
                    }).catch(function (err) {
                        reject(err);
                    });
                })
                    .catch(function (err) {
                    reject(err);
                });
            })
                .catch(function () {
                reject('Bad rooms zip file.');
            });
        });
    };
    ZipFileReader.getBuildingsListFromIndex = function (zip) {
        return new Promise(function (fulfill, reject) {
            var ind = zip.file('index.htm');
            if (ind === null) {
                reject('index.htm does not exist in the given zip file.');
            }
            else {
                ind.async('string').then(function (result) {
                    var bds = InsightHtmlParser_1.default.getBuildingList(parse5.parse(result));
                    var proms = [];
                    for (var _i = 0, bds_1 = bds; _i < bds_1.length; _i++) {
                        var b = bds_1[_i];
                        proms.push(b.setLatLon());
                    }
                    Promise.all(proms).then(function () {
                        fulfill(bds);
                    }).catch(function (err) {
                        reject(err);
                    });
                }).catch(function (err) {
                    reject(err);
                });
            }
        });
    };
    return ZipFileReader;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ZipFileReader;
//# sourceMappingURL=ZipFileReader.js.map