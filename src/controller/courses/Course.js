"use strict";
var Course = (function () {
    function Course(dept, id, avg, instructor, title, pass, fail, audit, uuid, year) {
        this.dept = dept;
        this.id = id;
        this.avg = avg;
        this.instructor = instructor;
        this.title = title;
        this.pass = pass;
        this.fail = fail;
        this.audit = audit;
        this.uuid = uuid;
        this.year = year;
    }
    Course.prototype.compress = function () {
        return [
            this.dept,
            this.id,
            this.avg,
            this.instructor,
            this.title,
            this.pass,
            this.fail,
            this.audit,
            this.uuid,
            this.year
        ];
    };
    Course.restore = function (data) {
        var result = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var r = data_1[_i];
            result.push({
                'courses_dept': r[0],
                'courses_id': r[1],
                'courses_avg': r[2],
                'courses_instructor': r[3],
                'courses_title': r[4],
                'courses_pass': r[5],
                'courses_fail': r[6],
                'courses_audit': r[7],
                'courses_uuid': r[8] + '',
                'courses_year': r[9]
            });
        }
        return result;
    };
    return Course;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Course;
//# sourceMappingURL=Course.js.map