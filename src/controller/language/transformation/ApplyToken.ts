import KeyUtil from "../key/KeyUtil";
const Decimal = require("decimal.js");

export default class ApplyToken {

    private token: string;
    private key: string;

    constructor(token: string, key: string) {
        this.token = token;
        this.key = key;
    }

    public static parse(input: any): ApplyToken {
        const keys: Array<string> = Object.keys(input);
        if (keys.length === 1) {
            const token: string = keys[0];
            ApplyToken.checkTokenValidity(input, token);
            const key: string = input[token];
            return new ApplyToken(token, key);
        } else {
            throw "apply token has more names than expected";
        }
    }

    private static checkTokenValidity(input: any, token: string): void {
        const key: any = input[token];
        switch(token) {
            case 'MAX':
            case 'MIN':
            case 'AVG':
            case 'SUM':
                if (!KeyUtil.isMathKey(key)) {
                    throw "key: "+ key + " does not apply to token: " + token;
                }
                return;
            case 'COUNT':
                if (!KeyUtil.isValidKey(key)) {
                    throw "key: " + key + "is not a valid key.";
                }
                return;
            default:
                throw "invalid token";
        }
    }

    getKey(): string {
        return this.key;
    }

    interp(data: Array<any>): any {
        const key: string = this.key;
        const raw: Array<any> = [];
        for (let row of data) {
            raw.push(row[key]);
        }
        switch(this.token) {
            case 'MAX': return ApplyToken.max(raw);
            case 'MIN': return ApplyToken.min(raw);
            case 'AVG': return Number((raw.map(val => <any>new Decimal(val)).reduce((a,b) => a.plus(b)).toNumber() / data.length).toFixed(2));
            case 'COUNT': return ApplyToken.count(raw);
            case 'SUM': return Number(raw.map(val => new Decimal(val)).reduce((a,b) => a.plus(b)).toNumber().toFixed(2));
        }
    }

    private static max(data: Array<any>): number {
        let m: number = data[0];
        for (let x of data) {
            if (x > m) {
                m = x;
            }
        }
        return m;
    }

    private static min(data: Array<any>): number {
        let m: number = data[0];
        for (let x of data) {
            if (x < m) {
                m = x;
            }
        }
        return m;
    }

    private static count(data: Array<any>): number {
        data.sort();
        let cnt: number = 1;
        let x: any = data[0];
        for (let i = 1; i < data.length; i++) {
            if (x !== data[i]) {
                cnt += 1;
                x = data[i];
            }
        }
        return cnt;
    }

}