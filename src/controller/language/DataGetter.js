"use strict";
var CourseRecord_1 = require("../courses/CourseRecord");
var Room_1 = require("../rooms/Room");
var KeyUtil_1 = require("./key/KeyUtil");
var DataGetter = (function () {
    function DataGetter() {
    }
    DataGetter.getData = function (record, key) {
        return KeyUtil_1.default.isCoursesKey(key) ? CourseRecord_1.default.get(record, key) : Room_1.default.get(record, key);
    };
    DataGetter.restoreCourses = function (data) {
        var result = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var row = data_1[_i];
            result.push(CourseRecord_1.default.makeCourse(row));
        }
        return result;
    };
    DataGetter.restoreRooms = function (data) {
        var result = [];
        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
            var row = data_2[_i];
            result.push(Room_1.default.makeRoom(row));
        }
        return result;
    };
    return DataGetter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataGetter;
//# sourceMappingURL=DataGetter.js.map