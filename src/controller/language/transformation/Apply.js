"use strict";
var ApplyKey_1 = require("./ApplyKey");
var Apply = (function () {
    function Apply(applyKeys) {
        this.applyKeys = applyKeys;
    }
    Apply.parse = function (input) {
        if (Array.isArray(input)) {
            var keys = [];
            for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
                var key = input_1[_i];
                keys.push(ApplyKey_1.default.parse(key));
            }
            Apply.checkUniquenessOfString(keys);
            return new Apply(keys);
        }
        else {
            throw "APPLY is not an array";
        }
    };
    Apply.checkUniquenessOfString = function (keys) {
        var lst = [];
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            lst.push(key.getName());
        }
        lst.sort();
        for (var i = 0; i < lst.length - 1; i++) {
            if (lst[i] === lst[i + 1]) {
                throw "apply key name is not unique";
            }
        }
    };
    Apply.prototype.getAllKeys = function () {
        var res = [];
        for (var _i = 0, _a = this.applyKeys; _i < _a.length; _i++) {
            var key = _a[_i];
            res.push(key.getKey());
        }
        return res;
    };
    Apply.prototype.getNames = function () {
        var res = [];
        for (var _i = 0, _a = this.applyKeys; _i < _a.length; _i++) {
            var key = _a[_i];
            res.push(key.getName());
        }
        return res;
    };
    Apply.prototype.interp = function (data) {
        var res = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var entity = data_1[_i];
            var obj = entity.getId();
            var content = entity.getContent();
            for (var _a = 0, _b = this.applyKeys; _a < _b.length; _a++) {
                var key = _b[_a];
                var name_1 = key.getName();
                var val = key.interp(content);
                obj[name_1] = val;
            }
            res.push(obj);
        }
        return res;
    };
    return Apply;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Apply;
//# sourceMappingURL=Apply.js.map