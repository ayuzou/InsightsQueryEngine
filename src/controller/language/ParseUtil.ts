/**
 * Utility factory for the query parser
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */

export default class ParseUtil {

    /**
     * Given an input and number of fields and throw an exception if input doesn't have expected number of fields
     *
     * @param obj
     * @param {number} num
     */
    static checkNumFields(obj: any, num: number): void {
        if (typeof obj === 'object') {
            let cnt: number = ParseUtil.addCount(obj);
            if (cnt !== num) {
                throw "object has wrong number of fields, expect: " + num;
            }
        } else {
            throw "given input is not an object";
        }
    }

    static checkNumFieldsRange(obj: any, start: number, end: number): void {
        if (typeof obj === 'object') {
            let cnt: number = ParseUtil.addCount(obj);
            if (cnt < start || cnt > end) {
                throw "object has wrong number of fields, expect: " + start + " - " + end;
            }
        } else {
            throw "given input is not an object";
        }
    }

    private static addCount(obj: any) {
        let cnt: number = 0;
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                cnt += 1;
            }
        }
        return cnt;
    }
}