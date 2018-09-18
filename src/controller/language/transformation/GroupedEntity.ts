export default class GroupedEntity {
    private id: any;
    private content: Array<any>;

    constructor(id: any) {
        this.id = id;
        this.content = [];
    }

    addContent(r: any): void {
        this.content.push(r);
    }

    getId(): any {
        return this.id;
    }

    getContent(): Array<any> {
        return this.content;
    }

    same(id: any): boolean {
        const keys: Array<string> = Object.keys(this.id);
        if (keys.length !== Object.keys(id).length) {
            return false;
        } else {
            for (let key of keys) {
                if (this.id[key] !== id[key]) {
                    return false;
                }
            }
            return true;
        }
    }

}