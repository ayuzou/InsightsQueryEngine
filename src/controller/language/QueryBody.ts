/**
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */
import {IQueryFilter} from "./filter/IQueryFilter";
import FilterCreator from "./filter/FilterCreator";
import ParseUtil from "./ParseUtil";
import NoFilter from "./filter/NoFilter";

export default class QueryBody {
    private filter: IQueryFilter;

    constructor(filter: IQueryFilter) {
        this.filter = filter;
    }

    static parse(input: any): QueryBody {
        if (Object.keys(input).length === 0) {
            return new QueryBody(new NoFilter());
        } else {
            ParseUtil.checkNumFields(input, 1);
            return new QueryBody(FilterCreator.create(input));
        }
    }

    interp(data: Array<any>): Array<any> {
        return this.filter.interp(data);
    }

    getAllKeys(): Array<string> {
        const r: Array<string> = [];
        for (let key of this.filter.getAllKeys()) {
            r.push(key);
        }
        return r;
    }
}