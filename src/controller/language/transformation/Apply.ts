import ApplyKey from "./ApplyKey";
import GroupedEntity from "./GroupedEntity";

export default class Apply {
    private applyKeys: Array<ApplyKey>;

    constructor(applyKeys: Array<ApplyKey>) {
        this.applyKeys = applyKeys;
    }

    public static parse(input: any): Apply {
        if (Array.isArray(input)) {
            const keys: Array<ApplyKey> = [];
            for (let key of input) {
                keys.push(ApplyKey.parse(key));
            }
            Apply.checkUniquenessOfString(keys);
            return new Apply(keys);
        } else {
            throw "APPLY is not an array";
        }
    }

    private static checkUniquenessOfString(keys: Array<ApplyKey>) {
        const lst: Array<string> = [];
        for (let key of keys) {
            lst.push(key.getName());
        }
        lst.sort();
        for (let i = 0; i < lst.length - 1; i++) {
            if (lst[i] === lst[i+1]) {
                throw "apply key name is not unique";
            }
        }
    }

    getAllKeys(): Array<string> {
        const res: Array<string> = [];
        for (let key of this.applyKeys) {
            res.push(key.getKey());
        }
        return res;
    }

    getNames(): Array<string> {
        const res: Array<string> = [];
        for (let key of this.applyKeys) {
            res.push(key.getName());
        }
        return res;
    }

    interp(data: Array<GroupedEntity>): Array<any> {
        const res: Array<any> = [];
        for (let entity of data) {
            const obj: any = entity.getId();
            const content: Array<any> = entity.getContent();
            for (let key of this.applyKeys) {
                const name: string = key.getName();
                const val: any = key.interp(content);
                obj[name] = val;
            }
            res.push(obj);
        }
        return res;
    }

}