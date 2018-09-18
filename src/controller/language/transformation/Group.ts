import KeyUtil from "../key/KeyUtil";
import GroupedEntity from "./GroupedEntity";

export default class Group {
    private keys: Array<string>;

    constructor(keys: Array<string>) {
        this.keys = keys;
    }

    public static parse(input: any): Group {
        if (Array.isArray(input) && input.length > 0 && KeyUtil.areValidKeys(input)) {
            return new Group(input);
        } else {
            throw "group keys are not an array or empty or not valid";
        }
    }

    getAllKeys(): Array<string> {
        return this.keys;
    }

    /**
     * [
     *  {
     *    id: {
     *     'rooms_shortname' : 'OSBO'
     *     }
     *    content: [
     *       [record],
     *      [record],
     *      ...
     *  ]
     *  },
     *  ...
     * ]
     */
    interp(data: Array<any>): Array<GroupedEntity> {
        if (data.length === 0) {
            return [];
        } else {
            const keys: Array<string> = this.keys;
            data.sort(function (a: any, b: any): number {
                for (let k of keys) {
                    if (a[k] < b[k]) {
                        return -1;
                    } else if (a[k] > b[k]) {
                        return 1;
                    }
                }
                return 0;
            });
            const grp0: GroupedEntity = new GroupedEntity(Group.cmpId(data[0], keys));
            grp0.addContent(data[0]);
            const res: Array<GroupedEntity> = [grp0];
            let curr: GroupedEntity = grp0;
            for (let i = 1; i < data.length; i++) {
                const a: any = data[i];
                const id: any = Group.cmpId(a, keys);
                if (curr.same(id)) {
                    curr.addContent(a);
                } else {
                    const grp1: GroupedEntity = new GroupedEntity(id);
                    grp1.addContent(a);
                    res.push(grp1);
                    curr = grp1;
                }
            }
            return res;
        }
    }

    private static cmpId(rec: any, keys: Array<string>): any {
        const id: any = {};
        for (let key of keys) {
            id[key] = rec[key];
        }
        return id;
    }

}