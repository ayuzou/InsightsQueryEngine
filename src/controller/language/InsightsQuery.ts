/**
 * Insights Query Node
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */

import QueryBody from "./QueryBody";
import QueryOptions from "./option/QueryOptions";
import KeyUtil from "./key/KeyUtil";
import Transformations from "./transformation/Transformations";

export default class InsightsQuery {
    private static WHERE: string = 'WHERE';
    private static OPTIONS: string = 'OPTIONS';
    private static TRANSFORMATIONS: string = 'TRANSFORMATIONS';

    private isCoursesQuery: boolean;
    private body: QueryBody;
    private options: QueryOptions;
    private transformations: Transformations;

    constructor(body: QueryBody, options: QueryOptions, transformations: Transformations) {
        this.body = body;
        this.options = options;
        this.transformations = transformations;
    }

    getIsCoursesQuery(): boolean {
        return this.isCoursesQuery;
    }

    setIsCoursesQuery(isCoursesQuery: boolean) {
        this.isCoursesQuery = isCoursesQuery;
    }

    static parse(input: any): InsightsQuery {
        InsightsQuery.checkProperties(input);
        const body: QueryBody = QueryBody.parse(input[InsightsQuery.WHERE]);
        const trans: Transformations = InsightsQuery.parseTransformations(input);
        const ops: QueryOptions = QueryOptions.parse(input[InsightsQuery.OPTIONS],
            InsightsQuery.getDisplayKeys(trans));
        const query: InsightsQuery = new InsightsQuery(body, ops, trans);
        query.setQueryType();
        return query;
    }

    private static parseTransformations(input: any): Transformations {
        return input.hasOwnProperty(InsightsQuery.TRANSFORMATIONS) ?
            Transformations.parse(input[InsightsQuery.TRANSFORMATIONS]) : null;
    }

    private static getDisplayKeys(trans: Transformations): Array<string> {
        return trans === null ? null : trans.getDisplayKeys();
    }

    private static checkProperties(input: any): void {
        const keys: Array<string> = Object.keys(input);
        if (keys.includes(InsightsQuery.WHERE) && keys.includes(InsightsQuery.OPTIONS)) {
            const l: number = keys.length;
            if (l === 2 || (l === 3 && keys.includes(InsightsQuery.TRANSFORMATIONS))) {
                return;
            } else {
                throw "wrong keys for the query";
            }
        } else {
            throw "query does not contain WHERE and OPTIONS";
        }
    }

    interp(data: Array<any>): Array<any> {
        const selected: Array<any> = this.body.interp(data);
        if (this.transformations !== null) {
            const transformed: Array<any> = this.transformations.interp(selected);
            return this.options.interp(transformed);
        } else {
            return this.options.interp(selected);
        }
    }

    getAllKeys(): Array<string> {
        const res: Array<string> = [];
        KeyUtil.put(res, this.body.getAllKeys());
        KeyUtil.put(res, this.options.getAllKeys());
        KeyUtil.put(res, this.transformations === null ? [] : this.transformations.getAllKeys());
        return res;
    }

    setQueryType() {
        const keys: Array<string> = this.getAllKeys();
        if (KeyUtil.areAllCourses(keys)) {
            this.isCoursesQuery = true;
        } else if (KeyUtil.areAllRooms(keys)) {
            this.isCoursesQuery = false;
        } else {
            throw 'err: keys are mixed';
        }
    }
}
