export interface IQueryFilter {
    interp(data: Array<any>): Array<any>;

    getAllKeys(): Array<string>;
}