"use strict";
var ParseUtil = (function () {
    function ParseUtil() {
    }
    ParseUtil.checkNumFields = function (obj, num) {
        if (typeof obj === 'object') {
            var cnt = ParseUtil.addCount(obj);
            if (cnt !== num) {
                throw "object has wrong number of fields, expect: " + num;
            }
        }
        else {
            throw "given input is not an object";
        }
    };
    ParseUtil.checkNumFieldsRange = function (obj, start, end) {
        if (typeof obj === 'object') {
            var cnt = ParseUtil.addCount(obj);
            if (cnt < start || cnt > end) {
                throw "object has wrong number of fields, expect: " + start + " - " + end;
            }
        }
        else {
            throw "given input is not an object";
        }
    };
    ParseUtil.addCount = function (obj) {
        var cnt = 0;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                cnt += 1;
            }
        }
        return cnt;
    };
    return ParseUtil;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParseUtil;
//# sourceMappingURL=ParseUtil.js.map