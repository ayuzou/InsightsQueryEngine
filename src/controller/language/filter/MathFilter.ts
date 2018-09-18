/**
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */
import {IQueryFilter} from "./IQueryFilter";
import MathFilterBody from "./MathFilterBody";

export default class MathFilter implements IQueryFilter {
    public static validComparators: Array<string> = ['LT', 'GT', 'EQ'];

    private comparator: string;
    private body: MathFilterBody;

    constructor(comparator: string, body: MathFilterBody) {
        this.comparator = comparator;
        this.body = body;
    }

    getAllKeys(): Array<string> {
        return [this.body.getMKey()];
    }

    static parse(comparator: string, body: any) {
        return new MathFilter(
            comparator,
            MathFilterBody.parse(body)
        );
    }

    interp(data: Array<any>): Array<any> {
        const res: Array<any> = [];
        for (let row of data) {
            const mkey: string = this.body.getMKey();
            const num: number = this.body.getNum();
            const val: number = row[mkey];
            let add: boolean = false;
            switch(this.comparator) {
                case 'LT': add = val < num;
                    break;
                case 'GT': add = val > num;
                break;
                case 'EQ': add = val === num;
                break;
            }
            if (add) {
                res.push(row);
            }
        }
        return res;
    }

}