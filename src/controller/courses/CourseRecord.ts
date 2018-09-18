/**
 * CourseRecord deals with details of checking if a course is valid, generating
 * a record(array), and get properties.
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */
import Course from "./Course";

export default class CourseRecord {

    private static SUBJECT: string = 'Subject';
    private static COURSE: string = 'Course';
    private static AVG: string = 'Avg';
    private static PROFESSOR: string = 'Professor';
    private static TITLE: string = 'Title';
    private static PASS: string = 'Pass';
    private static FAIL: string = 'Fail';
    private static AUDIT: string = 'Audit';
    private static ID: string = 'id';
    private static SECTION: string = 'Section';
    private static YEAR: string = 'Year';

    /**
     * Create a course record, which is an array containing string or number values.
     * Pre-condition: course needs to be a valid record
     *
     * @param course
     * @returns {CourseRecord}
     */
    static createCourse(course: any): Course {
        const year: number = (course.hasOwnProperty(CourseRecord.SECTION) && course[CourseRecord.SECTION] === 'overall') ?
            1900 : parseInt(course[CourseRecord.YEAR], 10);
        return new Course(
            course[CourseRecord.SUBJECT],
            course[CourseRecord.COURSE],
            course[CourseRecord.AVG],
            course[CourseRecord.PROFESSOR],
            course[CourseRecord.TITLE],
            course[CourseRecord.PASS],
            course[CourseRecord.FAIL],
            course[CourseRecord.AUDIT],
            course[CourseRecord.ID],
            year
        );
    }

    /**
     * Checking whether a record is a valid record, i.e., has all the required properties and correct types.
     *
     * @param record
     * @returns {boolean}
     */
    static isValidRecord(record: any): boolean {
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
    }

    private static hasValidYear(record: any): boolean {
        return record.hasOwnProperty(CourseRecord.YEAR) ? typeof record[CourseRecord.YEAR] === 'string' :
            record.hasOwnProperty(CourseRecord.SECTION) && record[CourseRecord.SECTION] === 'overall';
    }

}