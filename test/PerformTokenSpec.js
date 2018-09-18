"use strict";
var chai_1 = require("chai");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var Util_1 = require("../src/Util");
var PersistenceLayer_1 = require("../src/controller/PersistenceLayer");
describe("performQuery()", function () {
    var fs = require('fs');
    var path = require('path');
    var DIR_PATH = path.join(__dirname, 'data/');
    function readZipFileSync(fileName) {
        var filePath = DIR_PATH + fileName + '.zip';
        return fs.readFileSync(filePath, 'base64');
    }
    before(function (done) {
        this.timeout(10000);
        Util_1.default.test('Before: ' + this.test.parent.title);
        new InsightFacade_1.default().addDataset('rooms', readZipFileSync('rooms')).then(function () {
            done();
        });
    });
    beforeEach(function () {
        Util_1.default.test('BeforeTest: ' + this.currentTest.title);
    });
    after(function () {
        Util_1.default.test('After: ' + this.test.parent.title);
        PersistenceLayer_1.default.getInstance().clearAll();
    });
    it("SUM: should be able to perform simple d3 query", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture",
                    "sumSeats"
                ],
                "ORDER": "rooms_furniture"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{
                        "sumSeats": { "SUM": "rooms_seats" }
                    }]
            }
        };
        var expected = { "result": [{ "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "sumSeats": 1572 }, { "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "sumSeats": 6231 }, { "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs", "sumSeats": 212 }, { "rooms_furniture": "Classroom-Fixed Tablets", "sumSeats": 6332 }, { "rooms_furniture": "Classroom-Hybrid Furniture", "sumSeats": 381 }, { "rooms_furniture": "Classroom-Learn Lab", "sumSeats": 150 }, { "rooms_furniture": "Classroom-Movable Tables & Chairs", "sumSeats": 6479 }, { "rooms_furniture": "Classroom-Movable Tablets", "sumSeats": 1516 }, { "rooms_furniture": "Classroom-Moveable Tables & Chairs", "sumSeats": 506 }, { "rooms_furniture": "Classroom-Moveable Tablets", "sumSeats": 90 }] };
        return new InsightFacade_1.default()
            .performQuery(query)
            .then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal(expected);
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("AVG: should be able to perform simple d3 query", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture",
                    "avgSeats"
                ],
                "ORDER": "rooms_furniture"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{
                        "avgSeats": { "AVG": "rooms_seats" }
                    }]
            }
        };
        var expected = { "result": [{ "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "avgSeats": 157.2 }, { "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "avgSeats": 91.63 }, { "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs", "avgSeats": 70.67 }, { "rooms_furniture": "Classroom-Fixed Tablets", "avgSeats": 191.88 }, { "rooms_furniture": "Classroom-Hybrid Furniture", "avgSeats": 47.63 }, { "rooms_furniture": "Classroom-Learn Lab", "avgSeats": 50 }, { "rooms_furniture": "Classroom-Movable Tables & Chairs", "avgSeats": 39.27 }, { "rooms_furniture": "Classroom-Movable Tablets", "avgSeats": 34.45 }, { "rooms_furniture": "Classroom-Moveable Tables & Chairs", "avgSeats": 17.45 }, { "rooms_furniture": "Classroom-Moveable Tablets", "avgSeats": 90 }] };
        return new InsightFacade_1.default()
            .performQuery(query)
            .then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal(expected);
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("AVG: mix courses and rooms in the query", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "avgRoomLat"
                ],
                "ORDER": "rooms_furniture"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept"],
                "APPLY": [{
                        "avgRoomLat": { "AVG": "rooms_lat" }
                    }]
            }
        };
        return new InsightFacade_1.default()
            .performQuery(query)
            .then(function (response) {
            chai_1.expect.fail();
        })
            .catch(function (err) {
            chai_1.expect(err.code).to.be.equal(400);
        });
    });
    it("1complex sort with room sum", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture",
                    "sumSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["rooms_furniture"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{
                        "sumSeats": { "SUM": "rooms_seats" }
                    }]
            }
        };
        var expected = { "result": [{ "rooms_furniture": "Classroom-Moveable Tablets", "sumSeats": 90 }, { "rooms_furniture": "Classroom-Moveable Tables & Chairs", "sumSeats": 506 }, { "rooms_furniture": "Classroom-Movable Tablets", "sumSeats": 1516 }, { "rooms_furniture": "Classroom-Movable Tables & Chairs", "sumSeats": 6479 }, { "rooms_furniture": "Classroom-Learn Lab", "sumSeats": 150 }, { "rooms_furniture": "Classroom-Hybrid Furniture", "sumSeats": 381 }, { "rooms_furniture": "Classroom-Fixed Tablets", "sumSeats": 6332 }, { "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs", "sumSeats": 212 }, { "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "sumSeats": 6231 }, { "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "sumSeats": 1572 }] };
        return new InsightFacade_1.default()
            .performQuery(query)
            .then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal(expected);
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("2complex sort with room sum DOWN", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture",
                    "sumSeats",
                    "avgSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["sumSeats", "avgSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [
                    { "sumSeats": { "SUM": "rooms_seats" } },
                    { "avgSeats": { "AVG": "rooms_seats" } }
                ]
            }
        };
        var expected = { "result": [{ "rooms_furniture": "Classroom-Movable Tables & Chairs", "sumSeats": 6479, "avgSeats": 39.27 }, { "rooms_furniture": "Classroom-Fixed Tablets", "sumSeats": 6332, "avgSeats": 191.88 }, { "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "sumSeats": 6231, "avgSeats": 91.63 }, { "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "sumSeats": 1572, "avgSeats": 157.2 }, { "rooms_furniture": "Classroom-Movable Tablets", "sumSeats": 1516, "avgSeats": 34.45 }, { "rooms_furniture": "Classroom-Moveable Tables & Chairs", "sumSeats": 506, "avgSeats": 17.45 }, { "rooms_furniture": "Classroom-Hybrid Furniture", "sumSeats": 381, "avgSeats": 47.63 }, { "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs", "sumSeats": 212, "avgSeats": 70.67 }, { "rooms_furniture": "Classroom-Learn Lab", "sumSeats": 150, "avgSeats": 50 }, { "rooms_furniture": "Classroom-Moveable Tablets", "sumSeats": 90, "avgSeats": 90 }] };
        return new InsightFacade_1.default()
            .performQuery(query)
            .then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal(expected);
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("2complex sort room with sum UP", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture",
                    "sumSeats",
                    "avgSeats"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["sumSeats", "avgSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [
                    { "sumSeats": { "SUM": "rooms_seats" } },
                    { "avgSeats": { "AVG": "rooms_seats" } }
                ]
            }
        };
        var expected = { "result": [{ "rooms_furniture": "Classroom-Moveable Tablets", "sumSeats": 90, "avgSeats": 90 }, { "rooms_furniture": "Classroom-Learn Lab", "sumSeats": 150, "avgSeats": 50 }, { "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs", "sumSeats": 212, "avgSeats": 70.67 }, { "rooms_furniture": "Classroom-Hybrid Furniture", "sumSeats": 381, "avgSeats": 47.63 }, { "rooms_furniture": "Classroom-Moveable Tables & Chairs", "sumSeats": 506, "avgSeats": 17.45 }, { "rooms_furniture": "Classroom-Movable Tablets", "sumSeats": 1516, "avgSeats": 34.45 }, { "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "sumSeats": 1572, "avgSeats": 157.2 }, { "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "sumSeats": 6231, "avgSeats": 91.63 }, { "rooms_furniture": "Classroom-Fixed Tablets", "sumSeats": 6332, "avgSeats": 191.88 }, { "rooms_furniture": "Classroom-Movable Tables & Chairs", "sumSeats": 6479, "avgSeats": 39.27 }] };
        return new InsightFacade_1.default()
            .performQuery(query)
            .then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal(expected);
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("1complex sort with rooms_furniture sum", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture",
                    "sumSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["rooms_furniture"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{
                        "sumSeats": { "SUM": "rooms_seats" }
                    }]
            }
        };
        var expected = { "result": [{ "rooms_furniture": "Classroom-Moveable Tablets", "sumSeats": 90 }, { "rooms_furniture": "Classroom-Moveable Tables & Chairs", "sumSeats": 506 }, { "rooms_furniture": "Classroom-Movable Tablets", "sumSeats": 1516 }, { "rooms_furniture": "Classroom-Movable Tables & Chairs", "sumSeats": 6479 }, { "rooms_furniture": "Classroom-Learn Lab", "sumSeats": 150 }, { "rooms_furniture": "Classroom-Hybrid Furniture", "sumSeats": 381 }, { "rooms_furniture": "Classroom-Fixed Tablets", "sumSeats": 6332 }, { "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs", "sumSeats": 212 }, { "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "sumSeats": 6231 }, { "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "sumSeats": 1572 }] };
        return new InsightFacade_1.default()
            .performQuery(query)
            .then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal(expected);
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
});
describe("performQuery()", function () {
    var fs = require('fs');
    var path = require('path');
    var DIR_PATH = path.join(__dirname, 'data/');
    function readZipFileSync(fileName) {
        var filePath = DIR_PATH + fileName + '.zip';
        return fs.readFileSync(filePath, 'base64');
    }
    before(function (done) {
        this.timeout(10000);
        Util_1.default.test('Before: ' + this.test.parent.title);
        new InsightFacade_1.default().addDataset('courses', readZipFileSync('courses')).then(function () {
            done();
        });
    });
    beforeEach(function () {
        Util_1.default.test('BeforeTest: ' + this.currentTest.title);
    });
    after(function () {
        Util_1.default.test('After: ' + this.test.parent.title);
        PersistenceLayer_1.default.getInstance().clearAll();
    });
    it("AVG: mix courses and rooms in the query", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "avgRoomLat"
                ],
                "ORDER": "rooms_furniture"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept"],
                "APPLY": [{
                        "avgRoomLat": { "AVG": "rooms_lat" }
                    }]
            }
        };
        return new InsightFacade_1.default()
            .performQuery(query)
            .then(function (response) {
            chai_1.expect.fail();
        })
            .catch(function (err) {
            chai_1.expect(err.code).to.be.equal(400);
        });
    });
    it("AVG: courses_dept and average of courses_fail", function () {
        this.timeout(10000);
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "deptfail"
                ],
                "ORDER": "deptfail"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept"],
                "APPLY": [{
                        "deptfail": { "AVG": "courses_fail" }
                    }]
            }
        };
        var expected = { "result": [{ "courses_dept": "aanb", "deptfail": 0 }, { "courses_dept": "zool", "deptfail": 0 }, { "courses_dept": "ursy", "deptfail": 0 }, { "courses_dept": "udes", "deptfail": 0 }, { "courses_dept": "test", "deptfail": 0 }, { "courses_dept": "sts", "deptfail": 0 }, { "courses_dept": "soil", "deptfail": 0 }, { "courses_dept": "rsot", "deptfail": 0 }, { "courses_dept": "rmes", "deptfail": 0 }, { "courses_dept": "pols", "deptfail": 0 }, { "courses_dept": "phth", "deptfail": 0 }, { "courses_dept": "name", "deptfail": 0 }, { "courses_dept": "mrne", "deptfail": 0 }, { "courses_dept": "midw", "deptfail": 0 }, { "courses_dept": "lais", "deptfail": 0 }, { "courses_dept": "iwme", "deptfail": 0 }, { "courses_dept": "info", "deptfail": 0 }, { "courses_dept": "iar", "deptfail": 0 }, { "courses_dept": "hunu", "deptfail": 0 }, { "courses_dept": "hgse", "deptfail": 0 }, { "courses_dept": "gsat", "deptfail": 0 }, { "courses_dept": "gpp", "deptfail": 0 }, { "courses_dept": "gbpr", "deptfail": 0 }, { "courses_dept": "fish", "deptfail": 0 }, { "courses_dept": "bait", "deptfail": 0 }, { "courses_dept": "bala", "deptfail": 0 }, { "courses_dept": "dani", "deptfail": 0 }, { "courses_dept": "cnto", "deptfail": 0 }, { "courses_dept": "bapa", "deptfail": 0 }, { "courses_dept": "chil", "deptfail": 0 }, { "courses_dept": "basm", "deptfail": 0 }, { "courses_dept": "baul", "deptfail": 0 }, { "courses_dept": "cell", "deptfail": 0 }, { "courses_dept": "biof", "deptfail": 0 }, { "courses_dept": "ceen", "deptfail": 0 }, { "courses_dept": "bota", "deptfail": 0 }, { "courses_dept": "bama", "deptfail": 0.01 }, { "courses_dept": "bams", "deptfail": 0.01 }, { "courses_dept": "arst", "deptfail": 0.01 }, { "courses_dept": "path", "deptfail": 0.02 }, { "courses_dept": "edst", "deptfail": 0.02 }, { "courses_dept": "food", "deptfail": 0.02 }, { "courses_dept": "bahr", "deptfail": 0.02 }, { "courses_dept": "edcp", "deptfail": 0.02 }, { "courses_dept": "medi", "deptfail": 0.03 }, { "courses_dept": "libr", "deptfail": 0.03 }, { "courses_dept": "dent", "deptfail": 0.03 }, { "courses_dept": "nurs", "deptfail": 0.03 }, { "courses_dept": "bmeg", "deptfail": 0.04 }, { "courses_dept": "basc", "deptfail": 0.04 }, { "courses_dept": "larc", "deptfail": 0.04 }, { "courses_dept": "baen", "deptfail": 0.05 }, { "courses_dept": "plan", "deptfail": 0.05 }, { "courses_dept": "spph", "deptfail": 0.05 }, { "courses_dept": "nrsc", "deptfail": 0.05 }, { "courses_dept": "obst", "deptfail": 0.06 }, { "courses_dept": "epse", "deptfail": 0.06 }, { "courses_dept": "spha", "deptfail": 0.06 }, { "courses_dept": "libe", "deptfail": 0.07 }, { "courses_dept": "sowk", "deptfail": 0.07 }, { "courses_dept": "eece", "deptfail": 0.07 }, { "courses_dept": "anat", "deptfail": 0.07 }, { "courses_dept": "arch", "deptfail": 0.08 }, { "courses_dept": "rhsc", "deptfail": 0.08 }, { "courses_dept": "medg", "deptfail": 0.08 }, { "courses_dept": "ba", "deptfail": 0.08 }, { "courses_dept": "ccst", "deptfail": 0.08 }, { "courses_dept": "bafi", "deptfail": 0.09 }, { "courses_dept": "cohr", "deptfail": 0.1 }, { "courses_dept": "etec", "deptfail": 0.11 }, { "courses_dept": "onco", "deptfail": 0.11 }, { "courses_dept": "phar", "deptfail": 0.12 }, { "courses_dept": "urst", "deptfail": 0.13 }, { "courses_dept": "law", "deptfail": 0.13 }, { "courses_dept": "clch", "deptfail": 0.14 }, { "courses_dept": "grek", "deptfail": 0.14 }, { "courses_dept": "jrnl", "deptfail": 0.17 }, { "courses_dept": "phrm", "deptfail": 0.18 }, { "courses_dept": "pcth", "deptfail": 0.18 }, { "courses_dept": "ends", "deptfail": 0.19 }, { "courses_dept": "audi", "deptfail": 0.19 }, { "courses_dept": "fnel", "deptfail": 0.2 }, { "courses_dept": "pers", "deptfail": 0.2 }, { "courses_dept": "sans", "deptfail": 0.2 }, { "courses_dept": "cics", "deptfail": 0.21 }, { "courses_dept": "isci", "deptfail": 0.23 }, { "courses_dept": "baac", "deptfail": 0.23 }, { "courses_dept": "surg", "deptfail": 0.23 }, { "courses_dept": "port", "deptfail": 0.24 }, { "courses_dept": "fre", "deptfail": 0.25 }, { "courses_dept": "rgla", "deptfail": 0.25 }, { "courses_dept": "hinu", "deptfail": 0.25 }, { "courses_dept": "eced", "deptfail": 0.26 }, { "courses_dept": "dhyg", "deptfail": 0.26 }, { "courses_dept": "fipr", "deptfail": 0.27 }, { "courses_dept": "atsc", "deptfail": 0.29 }, { "courses_dept": "cnps", "deptfail": 0.29 }, { "courses_dept": "swed", "deptfail": 0.3 }, { "courses_dept": "chin", "deptfail": 0.3 }, { "courses_dept": "thtr", "deptfail": 0.32 }, { "courses_dept": "ufor", "deptfail": 0.33 }, { "courses_dept": "babs", "deptfail": 0.35 }, { "courses_dept": "russ", "deptfail": 0.38 }, { "courses_dept": "envr", "deptfail": 0.39 }, { "courses_dept": "igen", "deptfail": 0.39 }, { "courses_dept": "enph", "deptfail": 0.43 }, { "courses_dept": "mine", "deptfail": 0.45 }, { "courses_dept": "coec", "deptfail": 0.47 }, { "courses_dept": "fhis", "deptfail": 0.5 }, { "courses_dept": "punj", "deptfail": 0.53 }, { "courses_dept": "wood", "deptfail": 0.53 }, { "courses_dept": "adhe", "deptfail": 0.53 }, { "courses_dept": "cens", "deptfail": 0.55 }, { "courses_dept": "germ", "deptfail": 0.56 }, { "courses_dept": "fopr", "deptfail": 0.61 }, { "courses_dept": "educ", "deptfail": 0.62 }, { "courses_dept": "scan", "deptfail": 0.63 }, { "courses_dept": "arbc", "deptfail": 0.63 }, { "courses_dept": "lled", "deptfail": 0.66 }, { "courses_dept": "hebr", "deptfail": 0.67 }, { "courses_dept": "itst", "deptfail": 0.73 }, { "courses_dept": "appp", "deptfail": 0.75 }, { "courses_dept": "last", "deptfail": 0.81 }, { "courses_dept": "asic", "deptfail": 0.82 }, { "courses_dept": "grsj", "deptfail": 0.82 }, { "courses_dept": "korn", "deptfail": 0.83 }, { "courses_dept": "relg", "deptfail": 0.87 }, { "courses_dept": "visa", "deptfail": 0.94 }, { "courses_dept": "cogs", "deptfail": 0.96 }, { "courses_dept": "cnrs", "deptfail": 0.97 }, { "courses_dept": "laso", "deptfail": 1 }, { "courses_dept": "ital", "deptfail": 1.06 }, { "courses_dept": "fnh", "deptfail": 1.08 }, { "courses_dept": "anth", "deptfail": 1.09 }, { "courses_dept": "apbi", "deptfail": 1.1 }, { "courses_dept": "kin", "deptfail": 1.13 }, { "courses_dept": "mtrl", "deptfail": 1.14 }, { "courses_dept": "civl", "deptfail": 1.17 }, { "courses_dept": "musc", "deptfail": 1.19 }, { "courses_dept": "mdvl", "deptfail": 1.2 }, { "courses_dept": "arth", "deptfail": 1.2 }, { "courses_dept": "scie", "deptfail": 1.21 }, { "courses_dept": "japn", "deptfail": 1.27 }, { "courses_dept": "soci", "deptfail": 1.28 }, { "courses_dept": "frst", "deptfail": 1.29 }, { "courses_dept": "fren", "deptfail": 1.39 }, { "courses_dept": "fnis", "deptfail": 1.44 }, { "courses_dept": "engl", "deptfail": 1.45 }, { "courses_dept": "cons", "deptfail": 1.48 }, { "courses_dept": "span", "deptfail": 1.64 }, { "courses_dept": "ling", "deptfail": 1.69 }, { "courses_dept": "arcl", "deptfail": 1.7 }, { "courses_dept": "rmst", "deptfail": 1.7 }, { "courses_dept": "astu", "deptfail": 1.73 }, { "courses_dept": "lfs", "deptfail": 1.74 }, { "courses_dept": "comm", "deptfail": 1.75 }, { "courses_dept": "vant", "deptfail": 1.8 }, { "courses_dept": "chbe", "deptfail": 1.82 }, { "courses_dept": "asia", "deptfail": 1.85 }, { "courses_dept": "nest", "deptfail": 1.85 }, { "courses_dept": "hist", "deptfail": 1.87 }, { "courses_dept": "fist", "deptfail": 1.88 }, { "courses_dept": "geog", "deptfail": 1.95 }, { "courses_dept": "mech", "deptfail": 2.05 }, { "courses_dept": "cpen", "deptfail": 2.09 }, { "courses_dept": "latn", "deptfail": 2.09 }, { "courses_dept": "wrds", "deptfail": 2.26 }, { "courses_dept": "crwr", "deptfail": 2.35 }, { "courses_dept": "astr", "deptfail": 2.74 }, { "courses_dept": "eosc", "deptfail": 2.89 }, { "courses_dept": "micb", "deptfail": 3.02 }, { "courses_dept": "fmst", "deptfail": 3.15 }, { "courses_dept": "poli", "deptfail": 3.74 }, { "courses_dept": "geob", "deptfail": 3.8 }, { "courses_dept": "stat", "deptfail": 4.04 }, { "courses_dept": "bioc", "deptfail": 4.05 }, { "courses_dept": "clst", "deptfail": 4.13 }, { "courses_dept": "elec", "deptfail": 4.38 }, { "courses_dept": "econ", "deptfail": 4.73 }, { "courses_dept": "cpsc", "deptfail": 5.11 }, { "courses_dept": "apsc", "deptfail": 5.44 }, { "courses_dept": "caps", "deptfail": 5.58 }, { "courses_dept": "biol", "deptfail": 5.66 }, { "courses_dept": "phil", "deptfail": 6.31 }, { "courses_dept": "phys", "deptfail": 6.6 }, { "courses_dept": "busi", "deptfail": 7.54 }, { "courses_dept": "psyc", "deptfail": 7.62 }, { "courses_dept": "math", "deptfail": 10.58 }, { "courses_dept": "chem", "deptfail": 11.37 }] };
        return new InsightFacade_1.default()
            .performQuery(query)
            .then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal(expected);
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("SUM: courses_dept and average of courses_fail", function () {
        this.timeout(10000);
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "deptfail"
                ],
                "ORDER": "deptfail"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept"],
                "APPLY": [{
                        "deptfail": { "SUM": "courses_fail" }
                    }]
            }
        };
        var expected = { "result": [{ "courses_dept": "aanb", "deptfail": 0 }, { "courses_dept": "zool", "deptfail": 0 }, { "courses_dept": "ursy", "deptfail": 0 }, { "courses_dept": "udes", "deptfail": 0 }, { "courses_dept": "test", "deptfail": 0 }, { "courses_dept": "sts", "deptfail": 0 }, { "courses_dept": "soil", "deptfail": 0 }, { "courses_dept": "rsot", "deptfail": 0 }, { "courses_dept": "rmes", "deptfail": 0 }, { "courses_dept": "pols", "deptfail": 0 }, { "courses_dept": "phth", "deptfail": 0 }, { "courses_dept": "name", "deptfail": 0 }, { "courses_dept": "mrne", "deptfail": 0 }, { "courses_dept": "midw", "deptfail": 0 }, { "courses_dept": "lais", "deptfail": 0 }, { "courses_dept": "iwme", "deptfail": 0 }, { "courses_dept": "info", "deptfail": 0 }, { "courses_dept": "iar", "deptfail": 0 }, { "courses_dept": "hunu", "deptfail": 0 }, { "courses_dept": "hgse", "deptfail": 0 }, { "courses_dept": "gsat", "deptfail": 0 }, { "courses_dept": "gpp", "deptfail": 0 }, { "courses_dept": "gbpr", "deptfail": 0 }, { "courses_dept": "fish", "deptfail": 0 }, { "courses_dept": "bait", "deptfail": 0 }, { "courses_dept": "bala", "deptfail": 0 }, { "courses_dept": "dani", "deptfail": 0 }, { "courses_dept": "cnto", "deptfail": 0 }, { "courses_dept": "bapa", "deptfail": 0 }, { "courses_dept": "chil", "deptfail": 0 }, { "courses_dept": "basm", "deptfail": 0 }, { "courses_dept": "baul", "deptfail": 0 }, { "courses_dept": "cell", "deptfail": 0 }, { "courses_dept": "biof", "deptfail": 0 }, { "courses_dept": "ceen", "deptfail": 0 }, { "courses_dept": "bota", "deptfail": 0 }, { "courses_dept": "fhis", "deptfail": 2 }, { "courses_dept": "clch", "deptfail": 2 }, { "courses_dept": "anat", "deptfail": 2 }, { "courses_dept": "bams", "deptfail": 2 }, { "courses_dept": "arst", "deptfail": 2 }, { "courses_dept": "ufor", "deptfail": 2 }, { "courses_dept": "phrm", "deptfail": 2 }, { "courses_dept": "bama", "deptfail": 2 }, { "courses_dept": "onco", "deptfail": 2 }, { "courses_dept": "baen", "deptfail": 4 }, { "courses_dept": "bahr", "deptfail": 4 }, { "courses_dept": "urst", "deptfail": 4 }, { "courses_dept": "food", "deptfail": 4 }, { "courses_dept": "sans", "deptfail": 4 }, { "courses_dept": "bmeg", "deptfail": 4 }, { "courses_dept": "rgla", "deptfail": 4 }, { "courses_dept": "fnel", "deptfail": 4 }, { "courses_dept": "medi", "deptfail": 4 }, { "courses_dept": "nrsc", "deptfail": 4 }, { "courses_dept": "hinu", "deptfail": 4 }, { "courses_dept": "grek", "deptfail": 4 }, { "courses_dept": "ccst", "deptfail": 4 }, { "courses_dept": "basc", "deptfail": 4 }, { "courses_dept": "obst", "deptfail": 4 }, { "courses_dept": "jrnl", "deptfail": 6 }, { "courses_dept": "appp", "deptfail": 6 }, { "courses_dept": "edst", "deptfail": 6 }, { "courses_dept": "edcp", "deptfail": 6 }, { "courses_dept": "cics", "deptfail": 6 }, { "courses_dept": "coec", "deptfail": 8 }, { "courses_dept": "swed", "deptfail": 8 }, { "courses_dept": "path", "deptfail": 8 }, { "courses_dept": "libe", "deptfail": 8 }, { "courses_dept": "plan", "deptfail": 8 }, { "courses_dept": "pers", "deptfail": 10 }, { "courses_dept": "surg", "deptfail": 10 }, { "courses_dept": "dent", "deptfail": 10 }, { "courses_dept": "arbc", "deptfail": 10 }, { "courses_dept": "port", "deptfail": 12 }, { "courses_dept": "hebr", "deptfail": 12 }, { "courses_dept": "ba", "deptfail": 12 }, { "courses_dept": "larc", "deptfail": 12 }, { "courses_dept": "laso", "deptfail": 14 }, { "courses_dept": "libr", "deptfail": 14 }, { "courses_dept": "asic", "deptfail": 14 }, { "courses_dept": "rhsc", "deptfail": 16 }, { "courses_dept": "isci", "deptfail": 16 }, { "courses_dept": "cohr", "deptfail": 18 }, { "courses_dept": "babs", "deptfail": 18 }, { "courses_dept": "spha", "deptfail": 18 }, { "courses_dept": "medg", "deptfail": 20 }, { "courses_dept": "atsc", "deptfail": 22 }, { "courses_dept": "igen", "deptfail": 22 }, { "courses_dept": "nurs", "deptfail": 24 }, { "courses_dept": "mdvl", "deptfail": 24 }, { "courses_dept": "scan", "deptfail": 24 }, { "courses_dept": "enph", "deptfail": 24 }, { "courses_dept": "fnis", "deptfail": 26 }, { "courses_dept": "last", "deptfail": 26 }, { "courses_dept": "bafi", "deptfail": 28 }, { "courses_dept": "ends", "deptfail": 28 }, { "courses_dept": "spph", "deptfail": 30 }, { "courses_dept": "cnrs", "deptfail": 30 }, { "courses_dept": "envr", "deptfail": 32 }, { "courses_dept": "eece", "deptfail": 34 }, { "courses_dept": "pcth", "deptfail": 34 }, { "courses_dept": "rmst", "deptfail": 34 }, { "courses_dept": "baac", "deptfail": 36 }, { "courses_dept": "vant", "deptfail": 36 }, { "courses_dept": "punj", "deptfail": 36 }, { "courses_dept": "sowk", "deptfail": 38 }, { "courses_dept": "eced", "deptfail": 38 }, { "courses_dept": "russ", "deptfail": 46 }, { "courses_dept": "etec", "deptfail": 46 }, { "courses_dept": "cens", "deptfail": 48 }, { "courses_dept": "fipr", "deptfail": 48 }, { "courses_dept": "arch", "deptfail": 56 }, { "courses_dept": "fopr", "deptfail": 63 }, { "courses_dept": "fre", "deptfail": 66 }, { "courses_dept": "korn", "deptfail": 70 }, { "courses_dept": "epse", "deptfail": 70 }, { "courses_dept": "itst", "deptfail": 72 }, { "courses_dept": "arcl", "deptfail": 80 }, { "courses_dept": "astu", "deptfail": 90 }, { "courses_dept": "dhyg", "deptfail": 91 }, { "courses_dept": "cpen", "deptfail": 92 }, { "courses_dept": "relg", "deptfail": 94 }, { "courses_dept": "phar", "deptfail": 96 }, { "courses_dept": "latn", "deptfail": 98 }, { "courses_dept": "audi", "deptfail": 110 }, { "courses_dept": "educ", "deptfail": 114 }, { "courses_dept": "adhe", "deptfail": 122 }, { "courses_dept": "cogs", "deptfail": 132 }, { "courses_dept": "grsj", "deptfail": 132 }, { "courses_dept": "law", "deptfail": 148 }, { "courses_dept": "nest", "deptfail": 152 }, { "courses_dept": "scie", "deptfail": 170 }, { "courses_dept": "thtr", "deptfail": 170 }, { "courses_dept": "wood", "deptfail": 182 }, { "courses_dept": "cnps", "deptfail": 212 }, { "courses_dept": "mine", "deptfail": 237 }, { "courses_dept": "lfs", "deptfail": 252 }, { "courses_dept": "chin", "deptfail": 296 }, { "courses_dept": "anth", "deptfail": 304 }, { "courses_dept": "wrds", "deptfail": 318 }, { "courses_dept": "cons", "deptfail": 322 }, { "courses_dept": "ital", "deptfail": 344 }, { "courses_dept": "fist", "deptfail": 388 }, { "courses_dept": "lled", "deptfail": 403 }, { "courses_dept": "soci", "deptfail": 413 }, { "courses_dept": "germ", "deptfail": 468 }, { "courses_dept": "caps", "deptfail": 480 }, { "courses_dept": "crwr", "deptfail": 488 }, { "courses_dept": "arth", "deptfail": 508 }, { "courses_dept": "astr", "deptfail": 518 }, { "courses_dept": "apbi", "deptfail": 541 }, { "courses_dept": "visa", "deptfail": 562 }, { "courses_dept": "elec", "deptfail": 574 }, { "courses_dept": "kin", "deptfail": 782 }, { "courses_dept": "mtrl", "deptfail": 797 }, { "courses_dept": "fnh", "deptfail": 828 }, { "courses_dept": "ling", "deptfail": 836 }, { "courses_dept": "fmst", "deptfail": 908 }, { "courses_dept": "musc", "deptfail": 1012 }, { "courses_dept": "span", "deptfail": 1076 }, { "courses_dept": "asia", "deptfail": 1166 }, { "courses_dept": "frst", "deptfail": 1170 }, { "courses_dept": "bioc", "deptfail": 1200 }, { "courses_dept": "japn", "deptfail": 1227 }, { "courses_dept": "geob", "deptfail": 1286 }, { "courses_dept": "clst", "deptfail": 1416 }, { "courses_dept": "fren", "deptfail": 1420 }, { "courses_dept": "micb", "deptfail": 1444 }, { "courses_dept": "civl", "deptfail": 1451 }, { "courses_dept": "chbe", "deptfail": 1459 }, { "courses_dept": "stat", "deptfail": 1560 }, { "courses_dept": "geog", "deptfail": 1788 }, { "courses_dept": "hist", "deptfail": 1884 }, { "courses_dept": "poli", "deptfail": 1936 }, { "courses_dept": "phil", "deptfail": 2114 }, { "courses_dept": "mech", "deptfail": 2638 }, { "courses_dept": "engl", "deptfail": 3082 }, { "courses_dept": "apsc", "deptfail": 3560 }, { "courses_dept": "eosc", "deptfail": 4758 }, { "courses_dept": "cpsc", "deptfail": 5678 }, { "courses_dept": "comm", "deptfail": 6252 }, { "courses_dept": "phys", "deptfail": 7202 }, { "courses_dept": "econ", "deptfail": 10606 }, { "courses_dept": "psyc", "deptfail": 10670 }, { "courses_dept": "biol", "deptfail": 11560 }, { "courses_dept": "busi", "deptfail": 12717 }, { "courses_dept": "chem", "deptfail": 14259 }, { "courses_dept": "math", "deptfail": 29326 }] };
        return new InsightFacade_1.default()
            .performQuery(query)
            .then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal(expected);
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("complex sort with courses year avg", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_year",
                    "avgFail",
                    "avgPass",
                    "avgAudit"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["avgFail", "avgPass", "avgAudit"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_year"],
                "APPLY": [
                    { "avgFail": { "AVG": "courses_fail" } },
                    { "avgPass": { "AVG": "courses_pass" } },
                    { "avgAudit": { "AVG": "courses_audit" } }
                ]
            }
        };
        var expected = { "result": [{ "courses_year": 2015, "avgFail": 1.84, "avgPass": 48.83, "avgAudit": 0.11 }, { "courses_year": 2014, "avgFail": 1.89, "avgPass": 48.94, "avgAudit": 0.1 }, { "courses_year": 2011, "avgFail": 1.94, "avgPass": 46.2, "avgAudit": 0.14 }, { "courses_year": 2013, "avgFail": 1.99, "avgPass": 48.46, "avgAudit": 0.11 }, { "courses_year": 2016, "avgFail": 2.01, "avgPass": 49.67, "avgAudit": 0.08 }, { "courses_year": 2012, "avgFail": 2.02, "avgPass": 47.01, "avgAudit": 0.12 }, { "courses_year": 2008, "avgFail": 2.07, "avgPass": 44.72, "avgAudit": 0.16 }, { "courses_year": 2010, "avgFail": 2.1, "avgPass": 45.3, "avgAudit": 0.13 }, { "courses_year": 2009, "avgFail": 2.31, "avgPass": 47.33, "avgAudit": 0.12 }, { "courses_year": 2007, "avgFail": 2.34, "avgPass": 47.91, "avgAudit": 0.11 }, { "courses_year": 1900, "avgFail": 3.3, "avgPass": 77.1, "avgAudit": 0.21 }] };
        return new InsightFacade_1.default()
            .performQuery(query)
            .then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal(expected);
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("complex sort with courses avg order includes courses_year", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_year",
                    "avgFail",
                    "avgPass",
                    "avgAudit"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["avgFail", "avgPass", "avgAudit", "courses_year"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_year"],
                "APPLY": [
                    { "avgFail": { "AVG": "courses_fail" } },
                    { "avgPass": { "AVG": "courses_pass" } },
                    { "avgAudit": { "AVG": "courses_audit" } }
                ]
            }
        };
        var expected = {
            "result": [{
                    "courses_year": 2015,
                    "avgFail": 1.84,
                    "avgPass": 48.83,
                    "avgAudit": 0.11
                }, { "courses_year": 2014, "avgFail": 1.89, "avgPass": 48.94, "avgAudit": 0.1 }, {
                    "courses_year": 2011,
                    "avgFail": 1.94,
                    "avgPass": 46.2,
                    "avgAudit": 0.14
                }, { "courses_year": 2013, "avgFail": 1.99, "avgPass": 48.46, "avgAudit": 0.11 }, {
                    "courses_year": 2016,
                    "avgFail": 2.01,
                    "avgPass": 49.67,
                    "avgAudit": 0.08
                }, { "courses_year": 2012, "avgFail": 2.02, "avgPass": 47.01, "avgAudit": 0.12 }, {
                    "courses_year": 2008,
                    "avgFail": 2.07,
                    "avgPass": 44.72,
                    "avgAudit": 0.16
                }, { "courses_year": 2010, "avgFail": 2.1, "avgPass": 45.3, "avgAudit": 0.13 }, {
                    "courses_year": 2009,
                    "avgFail": 2.31,
                    "avgPass": 47.33,
                    "avgAudit": 0.12
                }, { "courses_year": 2007, "avgFail": 2.34, "avgPass": 47.91, "avgAudit": 0.11 }, {
                    "courses_year": 1900,
                    "avgFail": 3.3,
                    "avgPass": 77.1,
                    "avgAudit": 0.21
                }]
        };
        return new InsightFacade_1.default()
            .performQuery(query)
            .then(function (response) {
            chai_1.expect(response.code).to.equal(200);
            chai_1.expect(response.body).to.deep.equal(expected);
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("Invalid query with average on a string, courses_id", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "OR": [{
                                "IS": {
                                    "courses_dept": "math"
                                }
                            },
                            {
                                "IS": {
                                    "courses_dept": "adhe"
                                }
                            }
                        ]
                    }, {
                        "GT": {
                            "courses_avg": 60
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_instructor",
                    "average",
                    "count"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["count", "average", "courses_instructor"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_instructor"],
                "APPLY": [{
                        "count": {
                            "COUNT": "courses_avg"
                        }
                    },
                    {
                        "average": { "AVG": "courses_id" }
                    }]
            }
        };
        return new InsightFacade_1.default()
            .performQuery(query)
            .then(function (response) {
            chai_1.expect.fail();
        })
            .catch(function (err) {
            chai_1.expect(err.code).to.be.equal(400);
        });
    });
});
//# sourceMappingURL=PerformTokenSpec.js.map