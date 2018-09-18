/**
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */
import ColumnsOptions from "./ColumnsOptions";
import ParseUtil from "../ParseUtil";
import {OrderOptions} from "./OrderOptions";
import SortNodeFactory from "./sort/SortNodeFactory";

export default class QueryOptions {
    private columns: ColumnsOptions;
    private order: OrderOptions;

    constructor(columns: ColumnsOptions, order: OrderOptions) {
        this.columns = columns;
        this.order = order;
    }

    static parse(input: any, displayKeys: Array<string>): QueryOptions {
        ParseUtil.checkNumFieldsRange(input, 1, 2);

        if (input.hasOwnProperty('COLUMNS')) {
            let columns: ColumnsOptions = ColumnsOptions.parse(input['COLUMNS'], displayKeys);
            let order: OrderOptions = null;
            if (input.hasOwnProperty('ORDER')) {
                order = SortNodeFactory.parse(input['ORDER']);
                if (!order.checkValidity(columns.getKeys())) {
                    throw "order option not in columns";
                }
            }
            return new QueryOptions(columns, order);
        } else {
            throw "cannot find ColumnsOptions for QueryOptions";
        }
    }

    interp(data: Array<any>): Array<any> {
        let sorted: Array<any> = data;
        if (this.order !== null) {
            sorted = this.order.interp(data);
        }
        return this.columns.interp(sorted);
    }

    getAllKeys(): Array<string> {
        const result: Array<string> = [];

        for (let key of this.columns.getKeysForQueryTypeCheck()) {
            result.push(key);
        }
        return result;
    }
}