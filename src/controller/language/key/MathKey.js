"use strict";
var MathKey = (function () {
    function MathKey() {
    }
    return MathKey;
}());
MathKey.COURSES_AVG = 'courses_avg';
MathKey.COURSES_PASS = 'courses_pass';
MathKey.COURSES_FAIL = 'courses_fail';
MathKey.COURSES_AUDIT = 'courses_audit';
MathKey.COURSES_YEAR = 'courses_year';
MathKey.ROOMS_LAT = 'rooms_lat';
MathKey.ROOMS_LON = 'rooms_lon';
MathKey.ROOMS_SEATS = 'rooms_seats';
MathKey.validKeys = [
    MathKey.COURSES_AVG,
    MathKey.COURSES_PASS,
    MathKey.COURSES_FAIL,
    MathKey.COURSES_AUDIT,
    MathKey.COURSES_YEAR,
    MathKey.ROOMS_LAT,
    MathKey.ROOMS_LON,
    MathKey.ROOMS_SEATS
];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MathKey;
//# sourceMappingURL=MathKey.js.map