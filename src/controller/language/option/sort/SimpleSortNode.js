"use strict";
var SimpleSortNode = (function () {
    function SimpleSortNode(key) {
        this.key = key;
    }
    SimpleSortNode.parse = function (key) {
        return new SimpleSortNode(key);
    };
    SimpleSortNode.prototype.checkValidity = function (cols) {
        return cols.includes(this.key);
    };
    SimpleSortNode.prototype.interp = function (data) {
        var key = this.key;
        function comp(a, b) {
            var e1 = a[key];
            var e2 = b[key];
            return e1 < e2 ? -1 : (e1 > e2 ? 1 : 0);
        }
        return data.sort(comp);
    };
    return SimpleSortNode;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SimpleSortNode;
//# sourceMappingURL=SimpleSortNode.js.map