"use strict";
var Key_1 = require("./Key");
var KeyUtil = (function () {
    function KeyUtil() {
    }
    KeyUtil.isCoursesKey = function (key) {
        return Key_1.default.courseKeys.includes(key);
    };
    KeyUtil.areAllCourses = function (keys) {
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (!KeyUtil.isCoursesKey(key)) {
                return false;
            }
        }
        return true;
    };
    KeyUtil.isRoomsKey = function (key) {
        return Key_1.default.roomKeys.includes(key);
    };
    KeyUtil.areAllRooms = function (keys) {
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var key = keys_2[_i];
            if (!KeyUtil.isRoomsKey(key)) {
                return false;
            }
        }
        return true;
    };
    KeyUtil.isValidKey = function (k) {
        return Key_1.default.validKeys.includes(k);
    };
    KeyUtil.areValidKeys = function (keys) {
        return KeyUtil.areAllCourses(keys) || KeyUtil.areAllRooms(keys);
    };
    KeyUtil.isMathKey = function (key) {
        return Key_1.default.mathKeys.includes(key);
    };
    KeyUtil.isStringKey = function (key) {
        return Key_1.default.stringKeys.includes(key);
    };
    KeyUtil.put = function (res, keys) {
        for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
            var key = keys_3[_i];
            res.push(key);
        }
    };
    return KeyUtil;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KeyUtil;
//# sourceMappingURL=KeyUtil.js.map