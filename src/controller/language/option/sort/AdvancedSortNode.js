"use strict";
var SortDirection_1 = require("./SortDirection");
var ParseUtil_1 = require("../../ParseUtil");
var AdvancedSortNode = (function () {
    function AdvancedSortNode(direction, keys) {
        this.dir = direction;
        this.keys = keys;
    }
    AdvancedSortNode.parse = function (node) {
        ParseUtil_1.default.checkNumFields(node, 2);
        return new AdvancedSortNode(AdvancedSortNode.parseDirection(node), AdvancedSortNode.parsekeys(node));
    };
    AdvancedSortNode.parseDirection = function (node) {
        if (node.hasOwnProperty('dir')) {
            var d = node['dir'];
            if (d === 'UP') {
                return SortDirection_1.SortDirection.UP;
            }
            else if (d === 'DOWN') {
                return SortDirection_1.SortDirection.DOWN;
            }
            else {
                throw 'error getting direction of the sort node';
            }
        }
        else {
            throw 'advanced sort node does not have dir property';
        }
    };
    AdvancedSortNode.parsekeys = function (node) {
        if (node.hasOwnProperty('keys')) {
            var keys = node['keys'];
            if (Array.isArray(keys) && keys.length >= 1) {
                return keys;
            }
            else {
                throw 'keys is not an array or has no elements';
            }
        }
        else {
            throw 'advanced sort node does not have keys property';
        }
    };
    AdvancedSortNode.prototype.interp = function (data) {
        var keys = this.keys;
        return this.dir === SortDirection_1.SortDirection.UP ?
            data.sort(function (a, b) {
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var k = keys_1[_i];
                    if (a[k] < b[k]) {
                        return -1;
                    }
                    else if (a[k] > b[k]) {
                        return 1;
                    }
                }
                return 0;
            })
            : data.sort(function (a, b) {
                for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                    var k = keys_2[_i];
                    if (a[k] < b[k]) {
                        return 1;
                    }
                    else if (a[k] > b[k]) {
                        return -1;
                    }
                }
                return 0;
            });
    };
    AdvancedSortNode.prototype.checkValidity = function (columnKeys) {
        for (var _i = 0, _a = this.keys; _i < _a.length; _i++) {
            var k = _a[_i];
            if (!columnKeys.includes(k)) {
                return false;
            }
        }
        return true;
    };
    return AdvancedSortNode;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdvancedSortNode;
//# sourceMappingURL=AdvancedSortNode.js.map