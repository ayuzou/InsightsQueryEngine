"use strict";
var ColumnsOptions_1 = require("./ColumnsOptions");
var ParseUtil_1 = require("../ParseUtil");
var SortNodeFactory_1 = require("./sort/SortNodeFactory");
var QueryOptions = (function () {
    function QueryOptions(columns, order) {
        this.columns = columns;
        this.order = order;
    }
    QueryOptions.parse = function (input, displayKeys) {
        ParseUtil_1.default.checkNumFieldsRange(input, 1, 2);
        if (input.hasOwnProperty('COLUMNS')) {
            var columns = ColumnsOptions_1.default.parse(input['COLUMNS'], displayKeys);
            var order = null;
            if (input.hasOwnProperty('ORDER')) {
                order = SortNodeFactory_1.default.parse(input['ORDER']);
                if (!order.checkValidity(columns.getKeys())) {
                    throw "order option not in columns";
                }
            }
            return new QueryOptions(columns, order);
        }
        else {
            throw "cannot find ColumnsOptions for QueryOptions";
        }
    };
    QueryOptions.prototype.interp = function (data) {
        var sorted = data;
        if (this.order !== null) {
            sorted = this.order.interp(data);
        }
        return this.columns.interp(sorted);
    };
    QueryOptions.prototype.getAllKeys = function () {
        var result = [];
        for (var _i = 0, _a = this.columns.getKeysForQueryTypeCheck(); _i < _a.length; _i++) {
            var key = _a[_i];
            result.push(key);
        }
        return result;
    };
    return QueryOptions;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QueryOptions;
//# sourceMappingURL=QueryOptions.js.map