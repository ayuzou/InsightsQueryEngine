"use strict";
var StringFilter_1 = require("./StringFilter");
var NegationFilter_1 = require("./NegationFilter");
var LogicFilter_1 = require("./LogicFilter");
var MathFilter_1 = require("./MathFilter");
var ParseUtil_1 = require("../ParseUtil");
var FilterCreator = (function () {
    function FilterCreator() {
    }
    FilterCreator.create = function (body) {
        ParseUtil_1.default.checkNumFields(body, 1);
        if (body.hasOwnProperty('IS')) {
            return StringFilter_1.default.parse(body['IS']);
        }
        if (body.hasOwnProperty('NOT')) {
            return NegationFilter_1.default.parse(body['NOT']);
        }
        for (var _i = 0, _a = LogicFilter_1.default.validOperators; _i < _a.length; _i++) {
            var validLogic = _a[_i];
            if (body.hasOwnProperty(validLogic)) {
                return LogicFilter_1.default.parse(validLogic, body[validLogic]);
            }
        }
        for (var _b = 0, _c = MathFilter_1.default.validComparators; _b < _c.length; _b++) {
            var comparator = _c[_b];
            if (body.hasOwnProperty(comparator)) {
                return MathFilter_1.default.parse(comparator, body[comparator]);
            }
        }
        throw "cannot find a valid implementation to create IQueryFilter";
    };
    return FilterCreator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FilterCreator;
//# sourceMappingURL=FilterCreator.js.map