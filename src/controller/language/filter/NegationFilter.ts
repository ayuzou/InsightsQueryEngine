/**
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */
import {IQueryFilter} from "./IQueryFilter";
import FilterCreator from "./FilterCreator";
import ParseUtil from "../ParseUtil";

export default class NegationFilter implements IQueryFilter {
    private filter: IQueryFilter;

    constructor(filter: IQueryFilter) {
        this.filter = filter;
    }

    static parse(body: any): NegationFilter {
        ParseUtil.checkNumFields(body,1);
        return new NegationFilter(FilterCreator.create(body));
    }

    getAllKeys(): Array<string> {
        return this.filter.getAllKeys();
    }

    getFilter(): IQueryFilter {
        return this.filter;
    }

    interp(data: Array<any>): Array<any> {
        // optimization
        if (this.filter instanceof NegationFilter) {
            const inner: IQueryFilter = this.filter.getFilter();
            return inner.interp(data);
        } else {
            for (let row of this.filter.interp(data)) {
                row['rmv'] = true;
            }
            const res: Array<any> = [];
            for (let row of data) {
                if (row['rmv'] === true) {
                    delete row.rmv;
                } else {
                    res.push(row);
                }
            }
            return res;
        }
    }
}