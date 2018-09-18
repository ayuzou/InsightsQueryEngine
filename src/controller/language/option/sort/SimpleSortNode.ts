/**
 * Simple Sort Node
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */
import {OrderOptions} from "../OrderOptions";

export default class SimpleSortNode implements OrderOptions {
    private key: string;

    constructor(key: string) {
        this.key = key;
    }

    static parse(key: string): SimpleSortNode {
        return new SimpleSortNode(key);
    }

    checkValidity(cols: Array<string>) {
        return cols.includes(this.key);
    }

    interp(data: Array<any>): Array<any> {
        const key: string = this.key;
        function comp(a: any, b: any): number {
            const e1: any = a[key];
            const e2: any = b[key];
            return e1 < e2 ? -1 : (e1 > e2 ? 1 : 0);
        }
        return data.sort(comp);
    }

}