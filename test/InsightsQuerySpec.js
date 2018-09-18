"use strict";
var Util_1 = require("../src/Util");
var chai_1 = require("chai");
var QueryBody_1 = require("../src/controller/language/QueryBody");
var ColumnsOptions_1 = require("../src/controller/language/option/ColumnsOptions");
var QueryOptions_1 = require("../src/controller/language/option/QueryOptions");
var InsightsQuery_1 = require("../src/controller/language/InsightsQuery");
var MathFilter_1 = require("../src/controller/language/filter/MathFilter");
var MathFilterBody_1 = require("../src/controller/language/filter/MathFilterBody");
var NegationFilter_1 = require("../src/controller/language/filter/NegationFilter");
var WayOfSearch_1 = require("../src/controller/language/filter/WayOfSearch");
var SimpleSortNode_1 = require("../src/controller/language/option/sort/SimpleSortNode");
var AdvancedSortNode_1 = require("../src/controller/language/option/sort/AdvancedSortNode");
var SortDirection_1 = require("../src/controller/language/option/sort/SortDirection");
var Transformations_1 = require("../src/controller/language/transformation/Transformations");
var Group_1 = require("../src/controller/language/transformation/Group");
var Apply_1 = require("../src/controller/language/transformation/Apply");
var ApplyKey_1 = require("../src/controller/language/transformation/ApplyKey");
var ApplyToken_1 = require("../src/controller/language/transformation/ApplyToken");
var LogicFilter_1 = require("../src/controller/language/filter/LogicFilter");
var StringFilter_1 = require("../src/controller/language/filter/StringFilter");
var NoFilter_1 = require("../src/controller/language/filter/NoFilter");
describe("InsightsQuery parser", function () {
    before(function () {
        Util_1.default.test('Before: ' + this.test.parent.title);
    });
    beforeEach(function () {
        Util_1.default.test('BeforeTest: ' + this.currentTest.title);
    });
    after(function () {
        Util_1.default.test('After: ' + this.test.parent.title);
    });
    afterEach(function () {
        Util_1.default.test('AfterTest: ' + this.currentTest.title);
    });
    it("should be able to parse simple query", function () {
        var simpleQuery = {
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
        var result = InsightsQuery_1.default.parse(simpleQuery);
        var expected = new InsightsQuery_1.default(new QueryBody_1.default(new MathFilter_1.default('GT', new MathFilterBody_1.default('courses_avg', 97))), new QueryOptions_1.default(new ColumnsOptions_1.default([
            'courses_dept',
            'courses_avg'
        ]), new SimpleSortNode_1.default('courses_avg')), null);
        expected.setIsCoursesQuery(true);
        chai_1.expect(result).to.deep.equal(expected);
    });
    it("should be able to parse simple query", function () {
        var simpleQuery = {
            "WHERE": {
                "LT": {
                    "courses_avg": 50
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
        var result = InsightsQuery_1.default.parse(simpleQuery);
        var expected = new InsightsQuery_1.default(new QueryBody_1.default(new MathFilter_1.default('LT', new MathFilterBody_1.default('courses_avg', 50))), new QueryOptions_1.default(new ColumnsOptions_1.default([
            'courses_dept',
            'courses_avg'
        ]), new SimpleSortNode_1.default('courses_avg')), null);
        expected.setIsCoursesQuery(true);
        chai_1.expect(result).to.deep.equal(expected);
    });
    it("should be able to parse complex query", function () {
        var complexQuery = {
            "WHERE": {
                "OR": [
                    {
                        "AND": [
                            {
                                "GT": {
                                    "courses_avg": 90
                                }
                            },
                            {
                                "IS": {
                                    "courses_dept": "adhe"
                                }
                            }
                        ]
                    },
                    {
                        "EQ": {
                            "courses_avg": 95
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        var result = InsightsQuery_1.default.parse(complexQuery);
        var expected = new InsightsQuery_1.default(new QueryBody_1.default(new LogicFilter_1.default('OR', [
            new LogicFilter_1.default('AND', [
                new MathFilter_1.default('GT', new MathFilterBody_1.default('courses_avg', 90)),
                new StringFilter_1.default(WayOfSearch_1.WayOfSearch.MATCH, 'courses_dept', 'adhe')
            ]),
            new MathFilter_1.default('EQ', new MathFilterBody_1.default('courses_avg', 95))
        ])), new QueryOptions_1.default(new ColumnsOptions_1.default([
            'courses_dept',
            'courses_id',
            'courses_avg'
        ]), new SimpleSortNode_1.default('courses_avg')), null);
        expected.setIsCoursesQuery(true);
        chai_1.expect(result).to.deep.equal(expected);
    });
    it("should be able to parse query with NOT filter", function () {
        var simpleQuery = {
            "WHERE": {
                "NOT": {
                    "GT": {
                        "courses_avg": 97
                    }
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
        var result = InsightsQuery_1.default.parse(simpleQuery);
        var expected = new InsightsQuery_1.default(new QueryBody_1.default(new NegationFilter_1.default(new MathFilter_1.default('GT', new MathFilterBody_1.default('courses_avg', 97)))), new QueryOptions_1.default(new ColumnsOptions_1.default([
            'courses_dept',
            'courses_avg'
        ]), new SimpleSortNode_1.default('courses_avg')), null);
        expected.setIsCoursesQuery(true);
        chai_1.expect(result).to.deep.equal(expected);
    });
    it("should throw an error when no valid filter exists in the query", function () {
        var simpleQuery = {
            "WHERE": {
                "InvalidFiler": {
                    "Invalidkey": "InvalidValue"
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
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when no logic filter is not filled with an array", function () {
        var simpleQuery = {
            "WHERE": {
                "AND": {
                    "Invalidkey": "InvalidValue"
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
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when invalid field exists in MathFilterBody", function () {
        var simpleQuery = {
            "WHERE": {
                "NOT": {
                    "GT": {
                        "invalid_key": 25
                    }
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
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when value of MathFilterBody fields is not number type", function () {
        var simpleQuery = {
            "WHERE": {
                "NOT": {
                    "GT": {
                        "courses_avg": "notanumber"
                    }
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
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when value of StringFilter fields is not string type", function () {
        var simpleQuery = {
            "WHERE": {
                "NOT": {
                    "IS": {
                        "courses_title": 123
                    }
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
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when invalid field exists in StringFilter", function () {
        var simpleQuery = {
            "WHERE": {
                "NOT": {
                    "IS": {
                        "courses_avg": "88"
                    }
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
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when query is missing WHERE", function () {
        var simpleQuery = {
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when query is missing OPTIONS", function () {
        var simpleQuery = {
            "WHERE": {
                "NOT": {
                    "GT": {
                        "courses_avg": 97
                    }
                }
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when query OPTIONS is missing COLUMNS", function () {
        var simpleQuery = {
            "WHERE": {
                "GT": {
                    "courses_avg": 97
                }
            },
            "OPTIONS": {
                "ORDER": "courses_avg"
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when query has invalid key in COLUMNS", function () {
        var simpleQuery = {
            "WHERE": {
                "GT": {
                    "courses_avg": 97
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "invalid_key"
                ],
                "ORDER": "courses_avg"
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when query COLUMNS does not contain an array", function () {
        var simpleQuery = {
            "WHERE": {
                "GT": {
                    "courses_avg": 97
                }
            },
            "OPTIONS": {
                "COLUMNS": {},
                "ORDER": "courses_avg"
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when query cannot find a string type value for ORDER", function () {
        var simpleQuery = {
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
                "ORDER": 123
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when query cannot find a valid key value for ORDER", function () {
        var simpleQuery = {
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
                "ORDER": "invalid_key"
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when query cannot find a valid key value for ORDER", function () {
        var simpleQuery = {
            "WHERE": {
                "OR": {}
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "invalid_key"
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when nothing is inside COLUMNS", function () {
        var simpleQuery = {
            "WHERE": {
                "GT": {
                    "courses_avg": 97
                }
            },
            "OPTIONS": {
                "COLUMNS": [],
                "ORDER": "courses_avg"
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when ORDER string is not in COLUMNS", function () {
        var simpleQuery = {
            "WHERE": {
                "GT": {
                    "courses_avg": 97
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept"
                ],
                "ORDER": "courses_avg"
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when StringFilter is with only *", function () {
        var simpleQuery = {
            "WHERE": {
                "IS": {
                    "courses_instructor": "*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept"
                ],
                "ORDER": "courses_avg"
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when StringFilter is with only **", function () {
        var simpleQuery = {
            "WHERE": {
                "IS": {
                    "courses_instructor": "**"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept"
                ],
                "ORDER": "courses_avg"
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when WHERE is missing", function () {
        var simpleQuery = {
            "AAA": {
                "IS": {
                    "courses_instructor": "**"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept"
                ],
                "ORDER": "courses_avg"
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when OPTIONS is missing", function () {
        var simpleQuery = {
            "WHERE": {
                "IS": {
                    "courses_instructor": "**"
                }
            },
            "INVALID": {
                "COLUMNS": [
                    "courses_dept"
                ],
                "ORDER": "courses_avg"
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when WHERE does not have an object-type value", function () {
        var simpleQuery = {
            "WHERE": "invalid",
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept"
                ],
                "ORDER": "courses_avg"
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when OPTIONS have more than 2 fields", function () {
        var simpleQuery = {
            "WHERE": {
                "IS": {
                    "courses_instructor": "*wolf*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept"
                ],
                "ORDER": "courses_avg",
                "INVALID": "invalid"
            }
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should throw an error when OPTIONS do not have an object-type value", function () {
        var simpleQuery = {
            "WHERE": {
                "IS": {
                    "courses_instructor": "*wolf*"
                }
            },
            "OPTIONS": "invalid"
        };
        try {
            InsightsQuery_1.default.parse(simpleQuery);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("should be able to parse simple d3 query", function () {
        var query = {
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
        var result = InsightsQuery_1.default.parse(query);
        var expected = new InsightsQuery_1.default(new QueryBody_1.default(new LogicFilter_1.default('AND', [
            new StringFilter_1.default(WayOfSearch_1.WayOfSearch.CONTAINS, 'rooms_furniture', 'Tables'),
            new MathFilter_1.default('GT', new MathFilterBody_1.default('rooms_seats', 300))
        ])), new QueryOptions_1.default(new ColumnsOptions_1.default([
            'rooms_shortname',
            'maxSeats'
        ]), new AdvancedSortNode_1.default(SortDirection_1.SortDirection.DOWN, ['maxSeats'])), new Transformations_1.default(new Group_1.default(['rooms_shortname']), new Apply_1.default([new ApplyKey_1.default('maxSeats', new ApplyToken_1.default('MAX', 'rooms_seats'))])));
        expected.setIsCoursesQuery(false);
        chai_1.expect(result).to.deep.equal(expected);
    });
    it("should be able to parse simple d3 query", function () {
        var query = {
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
        var result = InsightsQuery_1.default.parse(query);
        var expected = new InsightsQuery_1.default(new QueryBody_1.default(new NoFilter_1.default()), new QueryOptions_1.default(new ColumnsOptions_1.default([
            'rooms_furniture'
        ]), new SimpleSortNode_1.default('rooms_furniture')), new Transformations_1.default(new Group_1.default(['rooms_furniture']), new Apply_1.default([])));
        expected.setIsCoursesQuery(false);
        chai_1.expect(result).to.deep.equal(expected);
    });
    it("d3 query missing dir", function () {
        var query = {
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
                    "cir": "DOWN",
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
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query dir is DOWNE", function () {
        var query = {
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
                    "dir": "DOWNE",
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
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query missing keys - keyss", function () {
        var query = {
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
                    "keyss": ["maxSeats"]
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
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query empty keys", function () {
        var query = {
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
                    "keys": []
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
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query order keys not in columns", function () {
        var query = {
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
                    "keys": ["notincolumn"]
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
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query the key is not in the display key", function () {
        var query = {
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
                    "maxSeats",
                    "minSeats"
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
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query wrong keys for the query", function () {
        var query = {
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
                    "keyss": ["maxSeats"]
                }
            },
            "REGULATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        };
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query err: keys are mixed", function () {
        var query = {
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
                    "courses_avg",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_avg"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "courses_avg"
                        }
                    }]
            }
        };
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("query object has wrong number of fields", function () {
        var query = {
            "WHERE": {
                "GT": {
                    "courses_avg": 97
                },
                "BT": {}
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query APPLY is not an array", function () {
        var query = {
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
                "APPLY": {
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }
            }
        };
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query apply key name is not unique", function () {
        var query = {
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
                "APPLY": [
                    { "maxSeats": { "MAX": "rooms_seats" } },
                    { "maxSeats": { "MAX": "rooms_seats" } }
                ]
            }
        };
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query apply key contains the '_' character", function () {
        var query = {
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
                    "max_Seats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["max_Seats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [
                    { "max_Seats": { "MAX": "rooms_seats" } }
                ]
            }
        };
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query apply key has more than one name", function () {
        var query = {
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
                "APPLY": [
                    {
                        "maxSeats": { "MAX": "rooms_seats" },
                        "minSeats": { "MIN": "rooms_seats" }
                    }
                ]
            }
        };
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query invalid token", function () {
        var query = {
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
                "APPLY": [
                    { "maxSeats": { "SAX": "rooms_seats" } }
                ]
            }
        };
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query APPLY invalid key", function () {
        var query = {
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
                "APPLY": [
                    { "maxSeats": { "MAX": "invalid_key" } }
                ]
            }
        };
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query APPLY invalid key 2", function () {
        var query = {
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
                "APPLY": [
                    { "maxSeats": { "COUNT": "invalid_key" } }
                ]
            }
        };
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
    it("d3 query apply token has more names than expected", function () {
        var query = {
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
                "APPLY": [
                    { "maxSeats": {
                            "MAX": "rooms_seats",
                            "MIN": "rooms_seats"
                        } }
                ]
            }
        };
        try {
            InsightsQuery_1.default.parse(query);
        }
        catch (err) {
            Util_1.default.test('Expected error caught: ' + err);
            return;
        }
        chai_1.expect.fail();
    });
});
//# sourceMappingURL=InsightsQuerySpec.js.map