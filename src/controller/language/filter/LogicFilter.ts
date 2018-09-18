/**
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */
import {IQueryFilter} from "./IQueryFilter";
import FilterCreator from "./FilterCreator";

export default class LogicFilter implements IQueryFilter {

    public static validOperators: Array<string> = ['AND', 'OR'];
    private operator: string;
    private filters: Array<IQueryFilter>;

    constructor(operator: string, filters: Array<IQueryFilter>) {
        this.operator = operator;
        this.filters = filters;
    }

    getAllKeys(): Array<string> {
        const res: Array<string> = [];
        for (let filter of this.filters) {
            const keys: Array<string> = filter.getAllKeys();
            for (let key of keys) {
                res.push(key);
            }
        }
        return res;
    }

    static parse(operator: string, filters: any): LogicFilter {
        if (Array.isArray(filters)) {
            if (filters.length < 1) {
                throw "empty array for logic filter";
            }
            const res: Array<IQueryFilter> = [];
            for (let body of filters) {
                res.push(FilterCreator.create(body));
            }
            return new LogicFilter(operator, res);
        } else {
            throw "filters input in not Array for LogicFilter";
        }
    }

    interp(data: Array<any>): Array<any> {
        if (this.operator === 'AND') {
            let res: Array<any> = data;
            for (let filter of this.filters) {
                res = filter.interp(res);
            }
            return res;
        } else { // OR
            for (let filter of this.filters) {
                const s: Array<any> = filter.interp(data);
                for (let r of s) {
                    r['use'] = true;
                }
            }
            const res: Array<any> = [];
            for (let r of data) {
                if (r['use'] === true) {
                    delete r.use;
                    res.push(r);
                }
            }
            return res;
        }
    }

}