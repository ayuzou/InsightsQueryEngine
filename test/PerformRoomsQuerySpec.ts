/**
 * Unit tests for performQuery() defined in IInsightFacade.ts
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */

import {expect} from 'chai';

import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";
import PersistenceLayer from "../src/controller/PersistenceLayer";

describe("performQuery()", function () {
    const fs = require('fs');
    const path = require('path');
    const DIR_PATH = path.join(__dirname, 'data/');

    function readZipFileSync(fileName: string) {
        const filePath: string = DIR_PATH + fileName + '.zip';
        return fs.readFileSync(filePath, 'base64');
    }

    before(function (done) {
        this.timeout(4000);
        Log.test('Before: ' + (<any>this).test.parent.title);
        new InsightFacade().addDataset('rooms', readZipFileSync('rooms')).then(function () {
            done();
        });
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        PersistenceLayer.getInstance().clearAll();
    });

    describe("rooms", function () {

        before(function (done) {
            this.timeout(4000);
            PersistenceLayer.getInstance().remove('rooms').then(function() {
                done();
            });
        });

        it("should reject when data set is missing", function () {
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
            return new InsightFacade()
                .performQuery(query)
                .then(function (response: InsightResponse) {
                    expect.fail();
                })
                .catch(function (err: InsightResponse) {
                    // pass
                    expect(err.code).to.be.equal(424);
                });
        });

        after(function (done) {
            this.timeout(4000);
            Log.test('Before: ' + (<any>this).test.parent.title);
            new InsightFacade().addDataset('rooms', readZipFileSync('rooms')).then(function () {
                done();
            });
        });
    });

    it("should reject when query is mixing courses and rooms", function () {
        const query: any = {
            "WHERE": {
                "IS": {
                    "courses_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        return new InsightFacade()
            .performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            })
            .catch(function (err: InsightResponse) {
                // pass
                expect(err.code).to.be.equal(400);
            });
    });

    it("should be able to perform simple query" ,function() {
        const simpleQuery: any = {
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
        const expected: any = {
            "result": [{
                "rooms_name": "DMP_101"
            }, {
                "rooms_name": "DMP_110"
            }, {
                "rooms_name": "DMP_201"
            }, {
                "rooms_name": "DMP_301"
            }, {
                "rooms_name": "DMP_310"
            }]
        };
        return new InsightFacade()
            .performQuery(simpleQuery)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("should be able to perform simple query" ,function() {
        const simpleQuery: any = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address", "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        const expected: any = {"result":[{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_101"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_110"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_201"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_301"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_310"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_1001"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3002"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3004"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3016"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3018"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3052"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3058"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3062"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3068"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3072"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3074"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4002"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4004"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4016"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4018"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4052"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4058"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4062"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4068"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4072"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4074"}]};
        return new InsightFacade()
            .performQuery(simpleQuery)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("should be able to perform simple query" ,function() {
        const simpleQuery: any = {
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name",
                    "rooms_fullname",
                    "rooms_shortname",
                    "rooms_number"
                ],
                "ORDER": "rooms_name"
            }
        };
        const expected: any = {"result":[{"rooms_name":"DMP_101","rooms_fullname":"Hugh Dempster Pavilion","rooms_shortname":"DMP","rooms_number":"101"},{"rooms_name":"DMP_110","rooms_fullname":"Hugh Dempster Pavilion","rooms_shortname":"DMP","rooms_number":"110"},{"rooms_name":"DMP_201","rooms_fullname":"Hugh Dempster Pavilion","rooms_shortname":"DMP","rooms_number":"201"},{"rooms_name":"DMP_301","rooms_fullname":"Hugh Dempster Pavilion","rooms_shortname":"DMP","rooms_number":"301"},{"rooms_name":"DMP_310","rooms_fullname":"Hugh Dempster Pavilion","rooms_shortname":"DMP","rooms_number":"310"}]};
        return new InsightFacade()
            .performQuery(simpleQuery)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("should be able to perform simple query" ,function() {
        const simpleQuery: any = {
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name",
                    "rooms_lat",
                    "rooms_lon",
                    "rooms_seats"
                ],
                "ORDER": "rooms_name"
            }
        };
        const expected: any = {"result":[{"rooms_name":"DMP_101","rooms_lat":49.26125,"rooms_lon":-123.24807,"rooms_seats":40},{"rooms_name":"DMP_110","rooms_lat":49.26125,"rooms_lon":-123.24807,"rooms_seats":120},{"rooms_name":"DMP_201","rooms_lat":49.26125,"rooms_lon":-123.24807,"rooms_seats":40},{"rooms_name":"DMP_301","rooms_lat":49.26125,"rooms_lon":-123.24807,"rooms_seats":80},{"rooms_name":"DMP_310","rooms_lat":49.26125,"rooms_lon":-123.24807,"rooms_seats":160}]};
        return new InsightFacade()
            .performQuery(simpleQuery)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("should be able to perform simple query" ,function() {
        const simpleQuery: any = {
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name",
                    "rooms_furniture",
                    "rooms_href"
                ],
                "ORDER": "rooms_name"
            }
        };
        const expected: any = {"result":[{"rooms_name":"DMP_101","rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-101"},{"rooms_name":"DMP_110","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-110"},{"rooms_name":"DMP_201","rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201"},{"rooms_name":"DMP_301","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-301"},{"rooms_name":"DMP_310","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-310"}]};
        return new InsightFacade()
            .performQuery(simpleQuery)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("should be able to perform simple query" ,function() {
        const simpleQuery: any = {
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name",
                    "rooms_type"
                ],
                "ORDER": "rooms_name"
            }
        };
        const expected: any = {"result":[{"rooms_name":"DMP_101","rooms_type":"Small Group"},{"rooms_name":"DMP_110","rooms_type":"Tiered Large Group"},{"rooms_name":"DMP_201","rooms_type":"Small Group"},{"rooms_name":"DMP_301","rooms_type":"Tiered Large Group"},{"rooms_name":"DMP_310","rooms_type":"Tiered Large Group"}]};
        return new InsightFacade()
            .performQuery(simpleQuery)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("should be able to handle a query which selects all courses" ,function() {
        const simpleQuery: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name",
                    "rooms_type"
                ],
                "ORDER": "rooms_name"
            }
        };
        return new InsightFacade()
            .performQuery(simpleQuery)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                const body: any = response.body;
                const result: Array<any> = body.result;
                expect(result.length).to.equal(364);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("should be able to perform simple d3 query" ,function() {
        const query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture"
                ],
                "ORDER": "rooms_furniture"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": []
            }
        };
        const expected: any = {
            "result": [{
                "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs"
            }, {
                "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs"
            }, {
                "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs"
            }, {
                "rooms_furniture": "Classroom-Fixed Tablets"
            }, {
                "rooms_furniture": "Classroom-Hybrid Furniture"
            }, {
                "rooms_furniture": "Classroom-Learn Lab"
            }, {
                "rooms_furniture": "Classroom-Movable Tables & Chairs"
            }, {
                "rooms_furniture": "Classroom-Movable Tablets"
            }, {
                "rooms_furniture": "Classroom-Moveable Tables & Chairs"
            }, {
                "rooms_furniture": "Classroom-Moveable Tablets"
            }]
        };
        return new InsightFacade()
            .performQuery(query)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("should be able to perform simple d3 query" ,function() {
        const query: any = {
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        };
        const expected: any = {
            "result": [{
                "rooms_shortname": "OSBO",
                "maxSeats": 442
            }, {
                "rooms_shortname": "HEBB",
                "maxSeats": 375
            }, {
                "rooms_shortname": "LSC",
                "maxSeats": 350
            }]
        };
        return new InsightFacade()
            .performQuery(query)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("COUNT: should be able to perform simple d3 query" ,function() {
        const query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture",
                    "countSeats"
                ],
                "ORDER": "rooms_furniture"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{
                    "countSeats" : {"COUNT": "rooms_seats"}
                }]
            }
        };
        const expected: any = {"result":[{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","countSeats":9},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","countSeats":37},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs","countSeats":2},{"rooms_furniture":"Classroom-Fixed Tablets","countSeats":27},{"rooms_furniture":"Classroom-Hybrid Furniture","countSeats":6},{"rooms_furniture":"Classroom-Learn Lab","countSeats":3},{"rooms_furniture":"Classroom-Movable Tables & Chairs","countSeats":40},{"rooms_furniture":"Classroom-Movable Tablets","countSeats":18},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","countSeats":10},{"rooms_furniture":"Classroom-Moveable Tablets","countSeats":1}]};
        return new InsightFacade()
            .performQuery(query)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("MAX: should be able to perform simple d3 query" ,function() {
        const query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture",
                    "maxSeats"
                ],
                "ORDER": "rooms_furniture"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{
                    "maxSeats" : {"MAX": "rooms_seats"}
                }]
            }
        };
        const expected: any = {"result":[{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","maxSeats":375},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","maxSeats":350},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs","maxSeats":78},{"rooms_furniture":"Classroom-Fixed Tablets","maxSeats":503},{"rooms_furniture":"Classroom-Hybrid Furniture","maxSeats":150},{"rooms_furniture":"Classroom-Learn Lab","maxSeats":72},{"rooms_furniture":"Classroom-Movable Tables & Chairs","maxSeats":442},{"rooms_furniture":"Classroom-Movable Tablets","maxSeats":68},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","maxSeats":40},{"rooms_furniture":"Classroom-Moveable Tablets","maxSeats":90}]};
        return new InsightFacade()
            .performQuery(query)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("AVG: should be able to perform simple d3 query" ,function() {
        const query: any = {
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
                    "avgSeats" : {"AVG": "rooms_seats"}
                }]
            }
        };
        const expected: any = {"result":[{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","avgSeats":157.2},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","avgSeats":91.63},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs","avgSeats":70.67},{"rooms_furniture":"Classroom-Fixed Tablets","avgSeats":191.88},{"rooms_furniture":"Classroom-Hybrid Furniture","avgSeats":47.63},{"rooms_furniture":"Classroom-Learn Lab","avgSeats":50},{"rooms_furniture":"Classroom-Movable Tables & Chairs","avgSeats":39.27},{"rooms_furniture":"Classroom-Movable Tablets","avgSeats":34.45},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","avgSeats":17.45},{"rooms_furniture":"Classroom-Moveable Tablets","avgSeats":90}]};
        return new InsightFacade()
            .performQuery(query)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("AVG: should be able to perform simple d3 query" ,function() {
        const query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_seats",
                    "avgSeats"
                ],
                "ORDER": "rooms_seats"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_seats"],
                "APPLY": [{
                    "avgSeats" : {"AVG": "rooms_seats"}
                }]
            }
        };
        const expected: any = {"result":[{"rooms_seats":6,"avgSeats":6},{"rooms_seats":7,"avgSeats":7},{"rooms_seats":8,"avgSeats":8},{"rooms_seats":10,"avgSeats":10},{"rooms_seats":12,"avgSeats":12},{"rooms_seats":14,"avgSeats":14},{"rooms_seats":16,"avgSeats":16},{"rooms_seats":18,"avgSeats":18},{"rooms_seats":20,"avgSeats":20},{"rooms_seats":21,"avgSeats":21},{"rooms_seats":22,"avgSeats":22},{"rooms_seats":24,"avgSeats":24},{"rooms_seats":25,"avgSeats":25},{"rooms_seats":26,"avgSeats":26},{"rooms_seats":27,"avgSeats":27},{"rooms_seats":28,"avgSeats":28},{"rooms_seats":29,"avgSeats":29},{"rooms_seats":30,"avgSeats":30},{"rooms_seats":31,"avgSeats":31},{"rooms_seats":32,"avgSeats":32},{"rooms_seats":33,"avgSeats":33},{"rooms_seats":34,"avgSeats":34},{"rooms_seats":35,"avgSeats":35},{"rooms_seats":36,"avgSeats":36},{"rooms_seats":37,"avgSeats":37},{"rooms_seats":38,"avgSeats":38},{"rooms_seats":39,"avgSeats":39},{"rooms_seats":40,"avgSeats":40},{"rooms_seats":41,"avgSeats":41},{"rooms_seats":42,"avgSeats":42},{"rooms_seats":43,"avgSeats":43},{"rooms_seats":44,"avgSeats":44},{"rooms_seats":45,"avgSeats":45},{"rooms_seats":47,"avgSeats":47},{"rooms_seats":48,"avgSeats":48},{"rooms_seats":50,"avgSeats":50},{"rooms_seats":51,"avgSeats":51},{"rooms_seats":53,"avgSeats":53},{"rooms_seats":54,"avgSeats":54},{"rooms_seats":55,"avgSeats":55},{"rooms_seats":56,"avgSeats":56},{"rooms_seats":58,"avgSeats":58},{"rooms_seats":60,"avgSeats":60},{"rooms_seats":62,"avgSeats":62},{"rooms_seats":63,"avgSeats":63},{"rooms_seats":65,"avgSeats":65},{"rooms_seats":66,"avgSeats":66},{"rooms_seats":68,"avgSeats":68},{"rooms_seats":70,"avgSeats":70},{"rooms_seats":72,"avgSeats":72},{"rooms_seats":74,"avgSeats":74},{"rooms_seats":75,"avgSeats":75},{"rooms_seats":76,"avgSeats":76},{"rooms_seats":78,"avgSeats":78},{"rooms_seats":80,"avgSeats":80},{"rooms_seats":84,"avgSeats":84},{"rooms_seats":88,"avgSeats":88},{"rooms_seats":90,"avgSeats":90},{"rooms_seats":94,"avgSeats":94},{"rooms_seats":99,"avgSeats":99},{"rooms_seats":100,"avgSeats":100},{"rooms_seats":102,"avgSeats":102},{"rooms_seats":106,"avgSeats":106},{"rooms_seats":108,"avgSeats":108},{"rooms_seats":112,"avgSeats":112},{"rooms_seats":114,"avgSeats":114},{"rooms_seats":120,"avgSeats":120},{"rooms_seats":123,"avgSeats":123},{"rooms_seats":125,"avgSeats":125},{"rooms_seats":131,"avgSeats":131},{"rooms_seats":136,"avgSeats":136},{"rooms_seats":144,"avgSeats":144},{"rooms_seats":150,"avgSeats":150},{"rooms_seats":154,"avgSeats":154},{"rooms_seats":155,"avgSeats":155},{"rooms_seats":160,"avgSeats":160},{"rooms_seats":167,"avgSeats":167},{"rooms_seats":181,"avgSeats":181},{"rooms_seats":183,"avgSeats":183},{"rooms_seats":187,"avgSeats":187},{"rooms_seats":188,"avgSeats":188},{"rooms_seats":190,"avgSeats":190},{"rooms_seats":200,"avgSeats":200},{"rooms_seats":205,"avgSeats":205},{"rooms_seats":224,"avgSeats":224},{"rooms_seats":225,"avgSeats":225},{"rooms_seats":228,"avgSeats":228},{"rooms_seats":236,"avgSeats":236},{"rooms_seats":240,"avgSeats":240},{"rooms_seats":250,"avgSeats":250},{"rooms_seats":257,"avgSeats":257},{"rooms_seats":260,"avgSeats":260},{"rooms_seats":265,"avgSeats":265},{"rooms_seats":275,"avgSeats":275},{"rooms_seats":280,"avgSeats":280},{"rooms_seats":299,"avgSeats":299},{"rooms_seats":325,"avgSeats":325},{"rooms_seats":350,"avgSeats":350},{"rooms_seats":375,"avgSeats":375},{"rooms_seats":426,"avgSeats":426},{"rooms_seats":442,"avgSeats":442},{"rooms_seats":503,"avgSeats":503}]};
        return new InsightFacade()
            .performQuery(query)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("AVG: twice avg seats, order sumSeats" ,function() {
        const query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_type",
                    "sumSeats",
                    "sumsSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["sumSeats", "rooms_type"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_type"],
                "APPLY": [
                    {"sumSeats" : {"AVG": "rooms_lat"}},
                    {"sumsSeats" : {"AVG" : "rooms_lat"}}
                ]
            }
        };
        const expected: any = {"result":[{"rooms_type":"TBD","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"Open Design General Purpose","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"Case Style","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"Tiered Large Group","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"Studio Lab","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"Small Group","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"Active Learning","sumSeats":49.26,"sumsSeats":49.26}]};
        return new InsightFacade()
            .performQuery(query)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("AVG: very very complicated" ,function() {
        const query: any =  {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture",
                    "rooms_type",
                    "sumSeats",
                    "sumsSeats"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["sumSeats", "rooms_type", "rooms_furniture"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_type", "rooms_furniture"],
                "APPLY": [
                    {"sumSeats" : {"AVG": "rooms_lat"}},
                    {"sumsSeats" : {"AVG" : "rooms_lat"}}
                ]
            }
        };
        const expected: any = {"result":[{"rooms_type":"Active Learning","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"Active Learning","rooms_furniture":"Classroom-Hybrid Furniture","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"Active Learning","rooms_furniture":"Classroom-Movable Tables & Chairs","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"Open Design General Purpose","rooms_furniture":"Classroom-Hybrid Furniture","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"Open Design General Purpose","rooms_furniture":"Classroom-Movable Tables & Chairs","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tables & Chairs","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"Studio Lab","rooms_furniture":"Classroom-Learn Lab","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Hybrid Furniture","sumSeats":49.26,"sumsSeats":49.26},{"rooms_type":"","rooms_furniture":"Classroom-Fixed Tablets","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"Case Style","rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"Case Style","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"Case Style","rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"Open Design General Purpose","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"Open Design General Purpose","rooms_furniture":"Classroom-Movable Tablets","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"Open Design General Purpose","rooms_furniture":"Classroom-Moveable Tables & Chairs","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"Open Design General Purpose","rooms_furniture":"Classroom-Moveable Tablets","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"TBD","rooms_furniture":"Classroom-Movable Tables & Chairs","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs","sumSeats":49.27,"sumsSeats":49.27},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets","sumSeats":49.27,"sumsSeats":49.27}]};
        return new InsightFacade()
            .performQuery(query)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("SUM: should be able to perform simple d3 query" ,function() {
        const query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_type",
                    "sumSeats"
                ],
                "ORDER": "rooms_type"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_type"],
                "APPLY": [{
                    "sumSeats" : {"SUM": "rooms_seats"}
                }]
            }
        };
        const expected: any = {"result":[{"rooms_type":"","sumSeats":60},{"rooms_type":"Active Learning","sumSeats":272},{"rooms_type":"Case Style","sumSeats":1525},{"rooms_type":"Open Design General Purpose","sumSeats":4475},{"rooms_type":"Small Group","sumSeats":3752},{"rooms_type":"Studio Lab","sumSeats":150},{"rooms_type":"TBD","sumSeats":929},{"rooms_type":"Tiered Large Group","sumSeats":12306}]};
        return new InsightFacade()
            .performQuery(query)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("SUM: sum rooms_seats order rooms_furniture" ,function() {
        const query: any = {
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
                    "sumSeats" : {"SUM": "rooms_seats"}
                }]
            }
        };
        const expected: any = {"result":[{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","sumSeats":1572},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","sumSeats":6231},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs","sumSeats":212},{"rooms_furniture":"Classroom-Fixed Tablets","sumSeats":6332},{"rooms_furniture":"Classroom-Hybrid Furniture","sumSeats":381},{"rooms_furniture":"Classroom-Learn Lab","sumSeats":150},{"rooms_furniture":"Classroom-Movable Tables & Chairs","sumSeats":6479},{"rooms_furniture":"Classroom-Movable Tablets","sumSeats":1516},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","sumSeats":506},{"rooms_furniture":"Classroom-Moveable Tablets","sumSeats":90}]};
        return new InsightFacade()
            .performQuery(query)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("SUM: sum rooms seats, order sumSeats" ,function() {
        const query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture",
                    "sumSeats"
                ],
                "ORDER": "sumSeats"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{
                    "sumSeats" : {"SUM": "rooms_seats"}
                }]
            }
        };
        const expected: any = {"result":[{"rooms_furniture":"Classroom-Moveable Tablets","sumSeats":90},{"rooms_furniture":"Classroom-Learn Lab","sumSeats":150},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs","sumSeats":212},{"rooms_furniture":"Classroom-Hybrid Furniture","sumSeats":381},{"rooms_furniture":"Classroom-Moveable Tables & Chairs","sumSeats":506},{"rooms_furniture":"Classroom-Movable Tablets","sumSeats":1516},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs","sumSeats":1572},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","sumSeats":6231},{"rooms_furniture":"Classroom-Fixed Tablets","sumSeats":6332},{"rooms_furniture":"Classroom-Movable Tables & Chairs","sumSeats":6479}]};
        return new InsightFacade()
            .performQuery(query)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("SUM: twice sum rooms seats, order sumSeats" ,function() {
        const query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_type",
                    "sumSeats",
                    "sumsSeats"
                ],
                "ORDER": "sumSeats"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_type"],
                "APPLY": [
                    {"sumSeats" : {"SUM": "rooms_seats"}},
                    {"sumsSeats" : {"SUM" : "rooms_seats"}}
                ]
            }
        };
        const expected: any = {"result":[{"rooms_type":"","sumSeats":60,"sumsSeats":60},{"rooms_type":"Studio Lab","sumSeats":150,"sumsSeats":150},{"rooms_type":"Active Learning","sumSeats":272,"sumsSeats":272},{"rooms_type":"TBD","sumSeats":929,"sumsSeats":929},{"rooms_type":"Case Style","sumSeats":1525,"sumsSeats":1525},{"rooms_type":"Small Group","sumSeats":3752,"sumsSeats":3752},{"rooms_type":"Open Design General Purpose","sumSeats":4475,"sumsSeats":4475},{"rooms_type":"Tiered Large Group","sumSeats":12306,"sumsSeats":12306}]};
        return new InsightFacade()
            .performQuery(query)
            .then(function (response: InsightResponse) {
                // pass
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal(expected);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });
});