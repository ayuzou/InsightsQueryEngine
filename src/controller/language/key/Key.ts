export default class Key {
    private static COURSES_AVG: string = 'courses_avg';
    private static COURSES_PASS: string = 'courses_pass';
    private static COURSES_FAIL: string = 'courses_fail';
    private static COURSES_AUDIT: string = 'courses_audit';
    private static COURSES_YEAR: string = 'courses_year';
    private static COURSES_DEPT: string = 'courses_dept';
    private static COURSES_ID: string = 'courses_id';
    private static COURSES_INSTRUCTOR: string = 'courses_instructor';
    private static COURSES_TITLE: string = 'courses_title';
    private static COURSES_UUID: string = 'courses_uuid';

    private static ROOMS_FULLNAME: string = 'rooms_fullname';
    private static ROOMS_SHORTNAME: string = 'rooms_shortname';
    private static ROOMS_NUMBER: string = 'rooms_number';
    private static ROOMS_NAME: string = 'rooms_name';
    private static ROOMS_ADDRESS: string = 'rooms_address';
    private static ROOMS_TYPE: string = 'rooms_type';
    private static ROOMS_FURNITURE: string = 'rooms_furniture';
    private static ROOMS_HREF: string = 'rooms_href';
    private static ROOMS_LAT: string = 'rooms_lat';
    private static ROOMS_LON: string = 'rooms_lon';
    private static ROOMS_SEATS: string = 'rooms_seats';

    public static validKeys: Array<string> = [
        Key.COURSES_DEPT,
        Key.COURSES_ID,
        Key.COURSES_AVG,
        Key.COURSES_INSTRUCTOR,
        Key.COURSES_TITLE,
        Key.COURSES_PASS,
        Key.COURSES_FAIL,
        Key.COURSES_AUDIT,
        Key.COURSES_UUID,
        Key.COURSES_YEAR,
        Key.ROOMS_FULLNAME,
        Key.ROOMS_SHORTNAME,
        Key.ROOMS_NUMBER,
        Key.ROOMS_NAME,
        Key.ROOMS_ADDRESS,
        Key.ROOMS_LAT,
        Key.ROOMS_LON,
        Key.ROOMS_SEATS,
        Key.ROOMS_TYPE,
        Key.ROOMS_FURNITURE,
        Key.ROOMS_HREF
    ];

    public static courseKeys: Array<string> = [
        Key.COURSES_DEPT,
        Key.COURSES_ID,
        Key.COURSES_AVG,
        Key.COURSES_INSTRUCTOR,
        Key.COURSES_TITLE,
        Key.COURSES_PASS,
        Key.COURSES_FAIL,
        Key.COURSES_AUDIT,
        Key.COURSES_UUID,
        Key.COURSES_YEAR
    ];

    public static roomKeys: Array<string> = [
        Key.ROOMS_FULLNAME,
        Key.ROOMS_SHORTNAME,
        Key.ROOMS_NUMBER,
        Key.ROOMS_NAME,
        Key.ROOMS_ADDRESS,
        Key.ROOMS_LAT,
        Key.ROOMS_LON,
        Key.ROOMS_SEATS,
        Key.ROOMS_TYPE,
        Key.ROOMS_FURNITURE,
        Key.ROOMS_HREF
    ];

    public static mathKeys: Array<string> = [
        Key.COURSES_AVG,
        Key.COURSES_PASS,
        Key.COURSES_FAIL,
        Key.COURSES_AUDIT,
        Key.COURSES_YEAR,
        Key.ROOMS_LAT,
        Key.ROOMS_LON,
        Key.ROOMS_SEATS
    ];

    public static stringKeys: Array<string> = [
        Key.COURSES_DEPT,
        Key.COURSES_ID,
        Key.COURSES_INSTRUCTOR,
        Key.COURSES_TITLE,
        Key.COURSES_UUID,
        Key.ROOMS_FULLNAME,
        Key.ROOMS_SHORTNAME,
        Key.ROOMS_NUMBER,
        Key.ROOMS_NAME,
        Key.ROOMS_ADDRESS,
        Key.ROOMS_TYPE,
        Key.ROOMS_FURNITURE,
        Key.ROOMS_HREF
    ];

}