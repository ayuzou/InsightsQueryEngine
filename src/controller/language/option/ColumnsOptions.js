"use strict";
var KeyUtil_1 = require("../key/KeyUtil");
var ColumnsOptions = (function () {
    function ColumnsOptions(keys) {
        this.keys = keys;
    }
    ColumnsOptions.prototype.getKeys = function () {
        return this.keys;
    };
    ColumnsOptions.prototype.getKeysForQueryTypeCheck = function () {
        var result = [];
        for (var _i = 0, _a = this.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            if (KeyUtil_1.default.isValidKey(key)) {
                result.push(key);
            }
        }
        return result;
    };
    ColumnsOptions.parse = function (keys, displayKeys) {
        if (Array.isArray(keys)) {
            if (keys.length < 1) {
                throw "no key found for ColumnsOptions";
            }
            ColumnsOptions.checkKeysValidity(keys, displayKeys);
            return new ColumnsOptions(keys);
        }
        else {
            throw "cannot find Array type for ColumnsOptions.keys";
        }
    };
    ColumnsOptions.checkKeysValidity = function (keys, displayKeys) {
        if (displayKeys === null) {
            if (!KeyUtil_1.default.areValidKeys(keys)) {
                throw "invalid key in ColumnsOptions.keys";
            }
        }
        else {
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (!displayKeys.includes(key)) {
                    throw "the key is not in the display key";
                }
            }
        }
    };
    ColumnsOptions.prototype.interp = function (data) {
        var keys = this.keys;
        var result = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var row = data_1[_i];
            var obj = {};
            for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
                var key = keys_2[_a];
                obj[key] = row[key];
            }
            result.push(obj);
        }
        return result;
    };
    return ColumnsOptions;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColumnsOptions;
//# sourceMappingURL=ColumnsOptions.js.map