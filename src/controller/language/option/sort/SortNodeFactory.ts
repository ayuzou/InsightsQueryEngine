import {OrderOptions} from "../OrderOptions";
import SimpleSortNode from "./SimpleSortNode";
import AdvancedSortNode from "./AdvancedSortNode";

export default class SortNodeFactory {

    static parse(key: any): OrderOptions {
        const t: string = typeof key;
        if (t === 'string') {
            return SimpleSortNode.parse(key);
        } else if (t === 'object') {
            return AdvancedSortNode.parse(key);
        } else {
            throw "cannot find a string type for OrderOptions. typeof key " + t;
        }
    }

}