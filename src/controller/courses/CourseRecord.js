"use strict";
var Course_1 = require("./Course");
var CourseRecord = (function () {
    function CourseRecord() {
    }
    CourseRecord.createCourse = function (course) {
        var year = (course.hasOwnProperty(CourseRecord.SECTION) && course[CourseRecord.SECTION] === 'overall') ?
            1900 : parseInt(course[CourseRecord.YEAR], 10);
        return new Course_1.default(course[CourseRecord.SUBJECT], course[CourseRecord.COURSE], course[CourseRecord.AVG], course[CourseRecord.PROFESSOR], course[CourseRecord.TITLE], course[CourseRecord.PASS], course[CourseRecord.FAIL], course[CourseRecord.AUDIT], course[CourseRecord.ID], year);
    };
    CourseRecord.isValidRecord = function (record) {
        return record.hasOwnProperty(CourseRecord.SUBJECT) && typeof record[CourseRecord.SUBJECT] === 'string' &&
            record.hasOwnProperty(CourseRecord.COURSE) && typeof record[CourseRecord.COURSE] === 'string' &&
            record.hasOwnProperty(CourseRecord.AVG) && typeof record[CourseRecord.AVG] === 'number' &&
            record.hasOwnProperty(CourseRecord.PROFESSOR) && typeof record[CourseRecord.PROFESSOR] === 'string' &&
            record.hasOwnProperty(CourseRecord.TITLE) && typeof record[CourseRecord.TITLE] === 'string' &&
            record.hasOwnProperty(CourseRecord.PASS) && typeof record[CourseRecord.PASS] === 'number' &&
            record.hasOwnProperty(CourseRecord.FAIL) && typeof record[CourseRecord.FAIL] === 'number' &&
            record.hasOwnProperty(CourseRecord.AUDIT) && typeof record[CourseRecord.AUDIT] === 'number' &&
            record.hasOwnProperty(CourseRecord.ID) &&
            (typeof record[CourseRecord.ID] === 'number' || typeof record[CourseRecord.ID] === 'string') &&
            CourseRecord.hasValidYear(record);
    };
    CourseRecord.hasValidYear = function (record) {
        return record.hasOwnProperty(CourseRecord.YEAR) ? typeof record[CourseRecord.YEAR] === 'string' :
            record.hasOwnProperty(CourseRecord.SECTION) && record[CourseRecord.SECTION] === 'overall';
    };
    return CourseRecord;
}());
CourseRecord.SUBJECT = 'Subject';
CourseRecord.COURSE = 'Course';
CourseRecord.AVG = 'Avg';
CourseRecord.PROFESSOR = 'Professor';
CourseRecord.TITLE = 'Title';
CourseRecord.PASS = 'Pass';
CourseRecord.FAIL = 'Fail';
CourseRecord.AUDIT = 'Audit';
CourseRecord.ID = 'id';
CourseRecord.SECTION = 'Section';
CourseRecord.YEAR = 'Year';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CourseRecord;
//# sourceMappingURL=CourseRecord.js.map