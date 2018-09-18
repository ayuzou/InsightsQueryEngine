"use strict";
var FilterCreator_1 = require("./filter/FilterCreator");
var ParseUtil_1 = require("./ParseUtil");
var NoFilter_1 = require("./filter/NoFilter");
var QueryBody = (function () {
    function QueryBody(filter) {
        this.filter = filter;
    }
    QueryBody.parse = function (input) {
        if (Object.keys(input).length === 0) {
            return new QueryBody(new NoFilter_1.default());
        }
        else {
            ParseUtil_1.default.checkNumFields(input, 1);
            return new QueryBody(FilterCreator_1.default.create(input));
        }
    };
    QueryBody.prototype.interp = function (data) {
        return this.filter.interp(data);
    };
    QueryBody.prototype.getAllKeys = function () {
        var r = [];
        for (var _i = 0, _a = this.filter.getAllKeys(); _i < _a.length; _i++) {
            var key = _a[_i];
            r.push(key);
        }
        return r;
    };
    return QueryBody;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QueryBody;
//# sourceMappingURL=QueryBody.js.map