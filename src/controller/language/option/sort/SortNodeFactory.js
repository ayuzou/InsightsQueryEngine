"use strict";
var SimpleSortNode_1 = require("./SimpleSortNode");
var AdvancedSortNode_1 = require("./AdvancedSortNode");
var SortNodeFactory = (function () {
    function SortNodeFactory() {
    }
    SortNodeFactory.parse = function (key) {
        var t = typeof key;
        if (t === 'string') {
            return SimpleSortNode_1.default.parse(key);
        }
        else if (t === 'object') {
            return AdvancedSortNode_1.default.parse(key);
        }
        else {
            throw "cannot find a string type for OrderOptions. typeof key " + t;
        }
    };
    return SortNodeFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SortNodeFactory;
//# sourceMappingURL=SortNodeFactory.js.map