import Group from "./Group";
import Apply from "./Apply";
import GroupedEntity from "./GroupedEntity";
import KeyUtil from "../key/KeyUtil";

export default class Transformations {
    private static GROUP: string = 'GROUP';
    private static APPLY: string = 'APPLY';

    private group: Group;
    private apply: Apply;

    constructor(group: Group, apply: Apply) {
        this.group = group;
        this.apply = apply;
    }

    public static parse(input: any): Transformations {
        Transformations.checkProperties(input);
        const group: Group = Group.parse(input[Transformations.GROUP]);
        const apply: Apply = Apply.parse(input[Transformations.APPLY]);
        return new Transformations(group, apply);
    }

    private static checkProperties(input: any): void {
        const keys: Array<string> = Object.keys(input);
        if (keys.length === 2 &&
            keys.includes(Transformations.GROUP) && keys.includes(Transformations.APPLY)) {
            return;
        } else {
            throw "tranformation does not have group and apply";
        }
    }

    getAllKeys(): Array<string> {
        const res: Array<string> = [];
        KeyUtil.put(res, this.group.getAllKeys());
        KeyUtil.put(res, this.apply.getAllKeys());
        return res;
    }

    getDisplayKeys(): Array<string> {
        const res: Array<string> = [];
        KeyUtil.put(res, this.group.getAllKeys());
        KeyUtil.put(res, this.apply.getNames());
        return res;
    }

    interp(data: Array<any>): any {
        const res: Array<GroupedEntity> = this.group.interp(data);
        return this.apply.interp(res);
    }

}