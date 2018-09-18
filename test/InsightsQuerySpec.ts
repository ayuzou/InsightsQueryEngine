/**
 * Unit tests for InsightsQuery parser
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */
import Log from "../src/Util";
import {expect} from 'chai';
import QueryBody from "../src/controller/language/QueryBody";
import ColumnsOptions from "../src/controller/language/option/ColumnsOptions";
import QueryOptions from "../src/controller/language/option/QueryOptions";
import InsightsQuery from "../src/controller/language/InsightsQuery";
import MathFilter from "../src/controller/language/filter/MathFilter";
import MathFilterBody from "../src/controller/language/filter/MathFilterBody";

import NegationFilter from "../src/controller/language/filter/NegationFilter";
import {WayOfSearch} from "../src/controller/language/filter/WayOfSearch";
import SimpleSortNode from "../src/controller/language/option/sort/SimpleSortNode";
import AdvancedSortNode from "../src/controller/language/option/sort/AdvancedSortNode";
import {SortDirection} from "../src/controller/language/option/sort/SortDirection";
import Transformations from "../src/controller/language/transformation/Transformations";
import Group from "../src/controller/language/transformation/Group";
import Apply from "../src/controller/language/transformation/Apply";
import ApplyKey from "../src/controller/language/transformation/ApplyKey";
import ApplyToken from "../src/controller/language/transformation/ApplyToken";
import LogicFilter from "../src/controller/language/filter/LogicFilter";
import StringFilter from "../src/controller/language/filter/StringFilter";
import NoFilter from "../src/controller/language/filter/NoFilter";


describe("InsightsQuery parser", function() {
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
    });

    it("should be able to parse simple query" ,function() {
        const simpleQuery: any = {
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
        const result: InsightsQuery = InsightsQuery.parse(simpleQuery);
        const expected: InsightsQuery = new InsightsQuery(
            new QueryBody (
                new MathFilter(
                    'GT',
                    new MathFilterBody('courses_avg', 97))
            ),
            new QueryOptions(
                new ColumnsOptions([
                    'courses_dept',
                    'courses_avg'
                ]),
                new SimpleSortNode('courses_avg')
            ),
            null
        );
        expected.setIsCoursesQuery(true);
        expect(result).to.deep.equal(expected);
    });

    it("should be able to parse simple query" ,function() {
        const simpleQuery: any = {
            "WHERE":{
                "LT":{
                    "courses_avg":50
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
        const result: InsightsQuery = InsightsQuery.parse(simpleQuery);
        const expected: InsightsQuery = new InsightsQuery(
            new QueryBody (
                new MathFilter(
                    'LT',
                    new MathFilterBody('courses_avg', 50))
            ),
            new QueryOptions(
                new ColumnsOptions([
                    'courses_dept',
                    'courses_avg'
                ]),
                new SimpleSortNode('courses_avg')
            ),
            null
        );
        expected.setIsCoursesQuery(true);
        expect(result).to.deep.equal(expected);
    });

    it("should be able to parse complex query", function () {
        const complexQuery = {
            "WHERE":{
                "OR":[
                    {
                        "AND":[
                            {
                                "GT":{
                                    "courses_avg":90
                                }
                            },
                            {
                                "IS":{
                                    "courses_dept":"adhe"
                                }
                            }
                        ]
                    },
                    {
                        "EQ":{
                            "courses_avg":95
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };
        const result = InsightsQuery.parse(complexQuery);
        const expected = new InsightsQuery(
            new QueryBody(
                new LogicFilter(
                    'OR',
                    [
                        new LogicFilter(
                            'AND',
                            [
                                new MathFilter(
                                    'GT',
                                    new MathFilterBody('courses_avg', 90)
                                ),
                                new StringFilter(
                                    WayOfSearch.MATCH,
                                    'courses_dept',
                                    'adhe'
                                )
                            ]
                        ),
                        new MathFilter(
                            'EQ',
                            new MathFilterBody('courses_avg', 95)
                        )
                    ]
                )
            ),
            new QueryOptions(
                new ColumnsOptions([
                    'courses_dept',
                    'courses_id',
                    'courses_avg'
                ]),
                new SimpleSortNode('courses_avg')
            ),
            null
        );
        expected.setIsCoursesQuery(true);
        expect(result).to.deep.equal(expected);
    });

    it("should be able to parse query with NOT filter" ,function() {
        const simpleQuery: any = {
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
                "ORDER":"courses_avg"
            }
        };
        const result: InsightsQuery = InsightsQuery.parse(simpleQuery);
        const expected: InsightsQuery = new InsightsQuery(
            new QueryBody (
                new NegationFilter(
                    new MathFilter(
                        'GT',
                        new MathFilterBody('courses_avg', 97))
                )
            ),
            new QueryOptions(
                new ColumnsOptions([
                    'courses_dept',
                    'courses_avg'
                ]),
                new SimpleSortNode('courses_avg')
            ),
            null
        );
        expected.setIsCoursesQuery(true);
        expect(result).to.deep.equal(expected);
    });

    it("should throw an error when no valid filter exists in the query" ,function() {
        const simpleQuery: any = {
            "WHERE": {
                "InvalidFiler": {
                    "Invalidkey" : "InvalidValue"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when no logic filter is not filled with an array" ,function() {
        const simpleQuery: any = {
            "WHERE": {
                "AND": {
                    "Invalidkey" : "InvalidValue"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when invalid field exists in MathFilterBody" ,function() {
        const simpleQuery: any = {
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
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch(err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when value of MathFilterBody fields is not number type" ,function() {
        const simpleQuery: any = {
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
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch(err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when value of StringFilter fields is not string type" ,function() {
        const simpleQuery: any = {
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
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch(err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when invalid field exists in StringFilter" ,function() {
        const simpleQuery: any = {
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
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch(err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when query is missing WHERE" ,function() {
        const simpleQuery: any = {
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch(err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when query is missing OPTIONS" ,function() {
        const simpleQuery: any = {
            "WHERE": {
                "NOT": {
                    "GT": {
                        "courses_avg": 97
                    }
                }
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch(err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when query OPTIONS is missing COLUMNS" ,function() {
        const simpleQuery: any = {
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch(err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when query has invalid key in COLUMNS" ,function() {
        const simpleQuery: any = {
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg",
                    "invalid_key"
                ],
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch(err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when query COLUMNS does not contain an array" ,function() {
        const simpleQuery: any = {
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":{},
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch(err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when query cannot find a string type value for ORDER" ,function() {
        const simpleQuery: any = {
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
                "ORDER": 123
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch(err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when query cannot find a valid key value for ORDER" ,function() {
        const simpleQuery: any = {
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
                "ORDER": "invalid_key"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch(err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when query cannot find a valid key value for ORDER" ,function() {
        const simpleQuery: any = {
            "WHERE":{
                "OR":{

                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "invalid_key"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch(err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when nothing is inside COLUMNS" ,function() {
        const simpleQuery: any = {
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[],
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when ORDER string is not in COLUMNS" ,function() {
        const simpleQuery: any = {
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept"
                ],
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when StringFilter is with only *" ,function() {
        const simpleQuery: any = {
            "WHERE":{
                "IS":{
                    "courses_instructor":"*"
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept"
                ],
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when StringFilter is with only **" ,function() {
        const simpleQuery: any = {
            "WHERE":{
                "IS":{
                    "courses_instructor":"**"
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept"
                ],
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when WHERE is missing" ,function() {
        const simpleQuery: any = {
            "AAA":{
                "IS":{
                    "courses_instructor":"**"
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept"
                ],
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when OPTIONS is missing" ,function() {
        const simpleQuery: any = {
            "WHERE":{
                "IS":{
                    "courses_instructor":"**"
                }
            },
            "INVALID":{
                "COLUMNS":[
                    "courses_dept"
                ],
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when WHERE does not have an object-type value" ,function() {
        const simpleQuery: any = {
            "WHERE":"invalid",
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept"
                ],
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when OPTIONS have more than 2 fields" ,function() {
        const simpleQuery: any = {
            "WHERE":{
                "IS":{
                    "courses_instructor":"*wolf*"
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept"
                ],
                "ORDER":"courses_avg",
                "INVALID":"invalid"
            }
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should throw an error when OPTIONS do not have an object-type value" ,function() {
        const simpleQuery: any = {
            "WHERE":{
                "IS":{
                    "courses_instructor":"*wolf*"
                }
            },
            "OPTIONS":"invalid"
        };
        try {
            InsightsQuery.parse(simpleQuery);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("should be able to parse simple d3 query" ,function() {
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
        const result: InsightsQuery = InsightsQuery.parse(query);
        const expected: InsightsQuery = new InsightsQuery(
            new QueryBody (
                new LogicFilter('AND',
                    [
                        new StringFilter(WayOfSearch.CONTAINS, 'rooms_furniture', 'Tables'),
                        new MathFilter('GT', new MathFilterBody('rooms_seats', 300))
                    ])
            ),
            new QueryOptions(
                new ColumnsOptions([
                    'rooms_shortname',
                    'maxSeats'
                ]),
                new AdvancedSortNode(SortDirection.DOWN, ['maxSeats'])
            ),
            new Transformations(
                new Group(['rooms_shortname']),
                new Apply([new ApplyKey(
                    'maxSeats',
                    new ApplyToken('MAX', 'rooms_seats')
                )])
            )
        );
        expected.setIsCoursesQuery(false);
        expect(result).to.deep.equal(expected);
    });

    it("should be able to parse simple d3 query" ,function() {
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
        const result: InsightsQuery = InsightsQuery.parse(query);
        const expected: InsightsQuery = new InsightsQuery(
            new QueryBody (
                new NoFilter()
            ),
            new QueryOptions(
                new ColumnsOptions([
                    'rooms_furniture'
                ]),
                new SimpleSortNode('rooms_furniture')
            ),
            new Transformations(
                new Group(['rooms_furniture']),
                new Apply([])
            )
        );
        expected.setIsCoursesQuery(false);
        expect(result).to.deep.equal(expected);
    });

    it("d3 query missing dir" ,function() {
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
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query dir is DOWNE" ,function() {
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
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query missing keys - keyss" ,function() {
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
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query empty keys" ,function() {
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
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query order keys not in columns" ,function() {
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
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query the key is not in the display key" ,function() {
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
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query wrong keys for the query" ,function() {
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
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query err: keys are mixed" ,function() {
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
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("query object has wrong number of fields" ,function() {
        const query: any = {
            "WHERE":{
                "GT":{
                    "courses_avg":97
                },
                "BT":{}
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };
        try {
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query APPLY is not an array" ,function() {
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
                "APPLY": {
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }
            }
        };
        try {
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query apply key name is not unique" ,function() {
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
                "APPLY": [
                    {"maxSeats": {"MAX": "rooms_seats"}},
                    {"maxSeats": {"MAX": "rooms_seats"}}
                ]
            }
        };
        try {
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query apply key contains the '_' character" ,function() {
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
                    {"max_Seats": {"MAX": "rooms_seats"}}
                ]
            }
        };
        try {
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query apply key has more than one name" ,function() {
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
                "APPLY": [
                    {
                        "maxSeats": {"MAX": "rooms_seats"},
                        "minSeats": {"MIN": "rooms_seats"}
                    }
                ]
            }
        };
        try {
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query invalid token" ,function() {
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
                "APPLY": [
                    {"maxSeats": {"SAX": "rooms_seats"}}
                ]
            }
        };
        try {
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query APPLY invalid key" ,function() {
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
                "APPLY": [
                    {"maxSeats": {"MAX": "invalid_key"}}
                ]
            }
        };
        try {
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query APPLY invalid key 2" ,function() {
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
                "APPLY": [
                    {"maxSeats": {"COUNT": "invalid_key"}}
                ]
            }
        };
        try {
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

    it("d3 query apply token has more names than expected" ,function() {
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
                "APPLY": [
                    {"maxSeats": {
                        "MAX": "rooms_seats",
                        "MIN": "rooms_seats"
                    }}
                ]
            }
        };
        try {
            InsightsQuery.parse(query);
        } catch (err) {
            Log.test('Expected error caught: ' + err);
            return;
        }
        expect.fail();
    });

});
