import {IQueryFilter} from "./IQueryFilter";

export default class NoFilter implements IQueryFilter {
    interp(data: Array<any>): Array<any> {
        return data;
    }

    getAllKeys(): Array<string> {
        return [];
    }
}