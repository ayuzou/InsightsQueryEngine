"use strict";
var FilterCreator_1 = require("./FilterCreator");
var LogicFilter = (function () {
    function LogicFilter(operator, filters) {
        this.operator = operator;
        this.filters = filters;
    }
    LogicFilter.prototype.getAllKeys = function () {
        var res = [];
        for (var _i = 0, _a = this.filters; _i < _a.length; _i++) {
            var filter = _a[_i];
            var keys = filter.getAllKeys();
            for (var _b = 0, keys_1 = keys; _b < keys_1.length; _b++) {
                var key = keys_1[_b];
                res.push(key);
            }
        }
        return res;
    };
    LogicFilter.parse = function (operator, filters) {
        if (Array.isArray(filters)) {
            if (filters.length < 1) {
                throw "empty array for logic filter";
            }
            var res = [];
            for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
                var body = filters_1[_i];
                res.push(FilterCreator_1.default.create(body));
            }
            return new LogicFilter(operator, res);
        }
        else {
            throw "filters input in not Array for LogicFilter";
        }
    };
    LogicFilter.prototype.interp = function (data) {
        if (this.operator === 'AND') {
            var res = data;
            for (var _i = 0, _a = this.filters; _i < _a.length; _i++) {
                var filter = _a[_i];
                res = filter.interp(res);
            }
            return res;
        }
        else {
            for (var _b = 0, _c = this.filters; _b < _c.length; _b++) {
                var filter = _c[_b];
                var s = filter.interp(data);
                for (var _d = 0, s_1 = s; _d < s_1.length; _d++) {
                    var r = s_1[_d];
                    r['use'] = true;
                }
            }
            var res = [];
            for (var _e = 0, data_1 = data; _e < data_1.length; _e++) {
                var r = data_1[_e];
                if (r['use'] === true) {
                    delete r.use;
                    res.push(r);
                }
            }
            return res;
        }
    };
    return LogicFilter;
}());
LogicFilter.validOperators = ['AND', 'OR'];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LogicFilter;
//# sourceMappingURL=LogicFilter.js.map