/**
 * Columns Options Node
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */
import KeyUtil from "../key/KeyUtil";

export default class ColumnsOptions {
    private keys: Array<string>;

    constructor(keys: Array<string>) {
        this.keys = keys;
    }

    getKeys(): Array<string> {
        return this.keys;
    }

    getKeysForQueryTypeCheck(): Array<string> {
        const result: Array<string> = [];
        for (let key of this.keys) {
            if (KeyUtil.isValidKey(key)) {
                result.push(key);
            }
        }
        return result;
    }

    static parse(keys: any, displayKeys: Array<string>): ColumnsOptions {
        if (Array.isArray(keys)) {
            if (keys.length < 1) {
                throw "no key found for ColumnsOptions";
            }
            ColumnsOptions.checkKeysValidity(keys, displayKeys);
            return new ColumnsOptions(keys);
        } else {
            throw "cannot find Array type for ColumnsOptions.keys";
        }
    }

    private static checkKeysValidity(keys: Array<string>, displayKeys: Array<string>): void {
        if (displayKeys === null) {
            if (!KeyUtil.areValidKeys(keys)) {
                throw "invalid key in ColumnsOptions.keys";
            }
        } else {
            for (let key of keys) {
                if (!displayKeys.includes(key)) {
                    throw "the key is not in the display key";
                }
            }
        }
    }

    interp(data: Array<any>): Array<any> {
        const keys: Array<string> = this.keys;
        const result: Array<any> = [];
        for (let row of data) {
            const obj: any = {};
            for (let key of keys) {
                obj[key] = row[key];
            }
            result.push(obj);
        }
        return result;
    }

}