"use strict";
var QueryBody_1 = require("./QueryBody");
var QueryOptions_1 = require("./option/QueryOptions");
var KeyUtil_1 = require("./key/KeyUtil");
var Transformations_1 = require("./transformation/Transformations");
var InsightsQuery = (function () {
    function InsightsQuery(body, options, transformations) {
        this.body = body;
        this.options = options;
        this.transformations = transformations;
    }
    InsightsQuery.prototype.getIsCoursesQuery = function () {
        return this.isCoursesQuery;
    };
    InsightsQuery.prototype.setIsCoursesQuery = function (isCoursesQuery) {
        this.isCoursesQuery = isCoursesQuery;
    };
    InsightsQuery.parse = function (input) {
        InsightsQuery.checkProperties(input);
        var body = QueryBody_1.default.parse(input[InsightsQuery.WHERE]);
        var trans = InsightsQuery.parseTransformations(input);
        var ops = QueryOptions_1.default.parse(input[InsightsQuery.OPTIONS], InsightsQuery.getDisplayKeys(trans));
        var query = new InsightsQuery(body, ops, trans);
        query.setQueryType();
        return query;
    };
    InsightsQuery.parseTransformations = function (input) {
        return input.hasOwnProperty(InsightsQuery.TRANSFORMATIONS) ?
            Transformations_1.default.parse(input[InsightsQuery.TRANSFORMATIONS]) : null;
    };
    InsightsQuery.getDisplayKeys = function (trans) {
        return trans === null ? null : trans.getDisplayKeys();
    };
    InsightsQuery.checkProperties = function (input) {
        var keys = Object.keys(input);
        if (keys.includes(InsightsQuery.WHERE) && keys.includes(InsightsQuery.OPTIONS)) {
            var l = keys.length;
            if (l === 2 || (l === 3 && keys.includes(InsightsQuery.TRANSFORMATIONS))) {
                return;
            }
            else {
                throw "wrong keys for the query";
            }
        }
        else {
            throw "query does not contain WHERE and OPTIONS";
        }
    };
    InsightsQuery.prototype.interp = function (data) {
        var selected = this.body.interp(data);
        if (this.transformations !== null) {
            var transformed = this.transformations.interp(selected);
            return this.options.interp(transformed);
        }
        else {
            return this.options.interp(selected);
        }
    };
    InsightsQuery.prototype.getAllKeys = function () {
        var res = [];
        KeyUtil_1.default.put(res, this.body.getAllKeys());
        KeyUtil_1.default.put(res, this.options.getAllKeys());
        KeyUtil_1.default.put(res, this.transformations === null ? [] : this.transformations.getAllKeys());
        return res;
    };
    InsightsQuery.prototype.setQueryType = function () {
        var keys = this.getAllKeys();
        if (KeyUtil_1.default.areAllCourses(keys)) {
            this.isCoursesQuery = true;
        }
        else if (KeyUtil_1.default.areAllRooms(keys)) {
            this.isCoursesQuery = false;
        }
        else {
            throw 'err: keys are mixed';
        }
    };
    return InsightsQuery;
}());
InsightsQuery.WHERE = 'WHERE';
InsightsQuery.OPTIONS = 'OPTIONS';
InsightsQuery.TRANSFORMATIONS = 'TRANSFORMATIONS';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InsightsQuery;
//# sourceMappingURL=InsightsQuery.js.map