/**
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */
import CourseRecord from "./CourseRecord";
import Course from "./Course";

export default class CourseRecordFilter {

    static filter(recs: Array<any>): Array<any> {
        const r: Array<any> = [];
        for (let rec of recs) {
            if (rec.hasOwnProperty('result')) {
                for (let cr of rec.result) {
                    if (CourseRecord.isValidRecord(cr)) {
                        const c: Course = CourseRecord.createCourse(cr);
                        r.push(c.compress());
                    }
                }
            }
        }
        return r;
    }

}