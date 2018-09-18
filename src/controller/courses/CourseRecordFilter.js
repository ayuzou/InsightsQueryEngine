"use strict";
var CourseRecord_1 = require("./CourseRecord");
var CourseRecordFilter = (function () {
    function CourseRecordFilter() {
    }
    CourseRecordFilter.filter = function (recs) {
        var r = [];
        for (var _i = 0, recs_1 = recs; _i < recs_1.length; _i++) {
            var rec = recs_1[_i];
            if (rec.hasOwnProperty('result')) {
                for (var _a = 0, _b = rec.result; _a < _b.length; _a++) {
                    var cr = _b[_a];
                    if (CourseRecord_1.default.isValidRecord(cr)) {
                        var c = CourseRecord_1.default.createCourse(cr);
                        r.push(c.compress());
                    }
                }
            }
        }
        return r;
    };
    return CourseRecordFilter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CourseRecordFilter;
//# sourceMappingURL=CourseRecordFilter.js.map