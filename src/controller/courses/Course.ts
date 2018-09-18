export default class Course {
    /**
     * Get the value based on the given string.
     * The intended semantics for each of the keys is as follows:
     * 0 courses_dept: string  - The department that offered the course.
     * 1 courses_id:   string  - The course number (will be treated as a string, e.g., 499b).
     * 2 courses_avg:  number  - The average of the course offering.
     * 3 courses_instructor: string - The instructor teaching the course offering.
     * 4 courses_title: string - The name of the course.
     * 5 courses_pass:  number - The number of students that passed the course offering.
     * 6 courses_fail:  number - The number of students that failed the course offering.
     * 7 courses_audit: number - The number of students that audited the course offering.
     * 8 courses_uuid:  string - The unique id of a course offering.
     * 9 courses_year:  number - The year the course was offered.
     */
    private dept: string;
    private id: string;
    private avg: number;
    private instructor: string;
    private title: string;
    private pass: number;
    private fail: number;
    private audit: number;
    private uuid: string;
    private year: number;

    constructor(dept: string, id: string, avg: number, instructor: string, title: string, pass: number, fail: number, audit: number,
                uuid: string, year: number) {
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

    compress(): Array<any> {
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
    }

    static restore(data: Array<any>): Array<any> {
        const result: Array<any> = [];
        for (let r of data) {
            result.push(
                {
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
                }
            );
        }
        return result;
    }

}