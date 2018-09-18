/**
 * @author Ayumi Imaizumi, Ziyang Jin
 */
import ParseUtil from "../ParseUtil";
import KeyUtil from "../key/KeyUtil";

export default class MathFilterBody {
    private mkey: string;
    private num: number;

    constructor(mkey: string, num: number) {
        this.mkey = mkey;
        this.num = num;
    }

    getMKey(): string {
        return this.mkey;
    }

    getNum(): number {
        return this.num;
    }

    static parse(input: any): MathFilterBody {
        ParseUtil.checkNumFields(input, 1);

        for (let key in input) {
            if (input.hasOwnProperty(key) && KeyUtil.isMathKey(key)) {
                if (typeof input[key] === 'number') {
                    return new MathFilterBody(key, input[key]);
                } else {
                    throw "cannot find a number type for MathFilterBody.num";
                }
            }
        }

        throw "invalid key found for MathFilterBody";
    }

}
