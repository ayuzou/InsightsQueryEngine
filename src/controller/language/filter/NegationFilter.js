"use strict";
var FilterCreator_1 = require("./FilterCreator");
var ParseUtil_1 = require("../ParseUtil");
var NegationFilter = (function () {
    function NegationFilter(filter) {
        this.filter = filter;
    }
    NegationFilter.parse = function (body) {
        ParseUtil_1.default.checkNumFields(body, 1);
        return new NegationFilter(FilterCreator_1.default.create(body));
    };
    NegationFilter.prototype.getAllKeys = function () {
        return this.filter.getAllKeys();
    };
    NegationFilter.prototype.getFilter = function () {
        return this.filter;
    };
    NegationFilter.prototype.interp = function (data) {
        if (this.filter instanceof NegationFilter) {
            var inner = this.filter.getFilter();
            return inner.interp(data);
        }
        else {
            for (var _i = 0, _a = this.filter.interp(data); _i < _a.length; _i++) {
                var row = _a[_i];
                row['rmv'] = true;
            }
            var res = [];
            for (var _b = 0, data_1 = data; _b < data_1.length; _b++) {
                var row = data_1[_b];
                if (row['rmv'] === true) {
                    delete row.rmv;
                }
                else {
                    res.push(row);
                }
            }
            return res;
        }
    };
    return NegationFilter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NegationFilter;
//# sourceMappingURL=NegationFilter.js.map