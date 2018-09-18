import ApplyToken from "./ApplyToken";

export default class ApplyKey {
    private name: string;
    private token: ApplyToken;

    constructor(name: string, token: ApplyToken) {
        this.name = name;
        this.token = token;
    }

    public static parse(input: any): ApplyKey {
        const keys: Array<string> = Object.keys(input);
        if (keys.length === 1) {
            const name: string = keys[0];
            ApplyKey.checkUnderScroll(name);
            return new ApplyKey(name, ApplyToken.parse(input[name]));
        } else {
            throw "apply key has more than one name";
        }
    }

    private static checkUnderScroll(key: string) {
        if (key.indexOf('_') !== -1) {
            throw "apply key contains the '_' character";
        }
    }

    getKey(): string {
        return this.token.getKey();
    }

    getName(): string {
        return this.name;
    }

    interp(data: Array<any>): any {
        return this.token.interp(data);
    }

}