"use strict";
var MathFilterBody_1 = require("./MathFilterBody");
var MathFilter = (function () {
    function MathFilter(comparator, body) {
        this.comparator = comparator;
        this.body = body;
    }
    MathFilter.prototype.getAllKeys = function () {
        return [this.body.getMKey()];
    };
    MathFilter.parse = function (comparator, body) {
        return new MathFilter(comparator, MathFilterBody_1.default.parse(body));
    };
    MathFilter.prototype.interp = function (data) {
        var res = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var row = data_1[_i];
            var mkey = this.body.getMKey();
            var num = this.body.getNum();
            var val = row[mkey];
            var add = false;
            switch (this.comparator) {
                case 'LT':
                    add = val < num;
                    break;
                case 'GT':
                    add = val > num;
                    break;
                case 'EQ':
                    add = val === num;
                    break;
            }
            if (add) {
                res.push(row);
            }
        }
        return res;
    };
    return MathFilter;
}());
MathFilter.validComparators = ['LT', 'GT', 'EQ'];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MathFilter;
//# sourceMappingURL=MathFilter.js.map