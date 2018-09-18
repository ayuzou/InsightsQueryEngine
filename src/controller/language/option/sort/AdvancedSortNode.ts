import {OrderOptions} from "../OrderOptions";
import {SortDirection} from "./SortDirection";
import ParseUtil from "../../ParseUtil";

export default class AdvancedSortNode implements OrderOptions {

    private dir: SortDirection;
    private keys: Array<string>;

    constructor(direction: SortDirection, keys: Array<string>) {
        this.dir = direction;
        this.keys = keys;
    }

    static parse(node: any): AdvancedSortNode {
        ParseUtil.checkNumFields(node, 2);
        return new AdvancedSortNode(
            AdvancedSortNode.parseDirection(node),
            AdvancedSortNode.parsekeys(node)
        );
    }

    private static parseDirection(node: any): SortDirection {
        if (node.hasOwnProperty('dir')) {
            const d: string = node['dir'];
            if (d === 'UP') {
                return SortDirection.UP
            } else if (d === 'DOWN') {
                return SortDirection.DOWN;
            } else {
                throw 'error getting direction of the sort node';
            }
        } else {
            throw 'advanced sort node does not have dir property';
        }
    }

    private static parsekeys(node: any): Array<string> {
        if (node.hasOwnProperty('keys')) {
            const keys: Array<string> = node['keys'];
            if (Array.isArray(keys) && keys.length >= 1) {
                return keys;
            } else {
                throw 'keys is not an array or has no elements';
            }
        } else {
            throw 'advanced sort node does not have keys property';
        }
    }

    interp(data: Array<any>): Array<any> {
        const keys: Array<string> = this.keys;
        return this.dir === SortDirection.UP ?
            data.sort(function (a: any, b: any): number {
                for (let k of keys) {
                    if (a[k] < b[k]) {
                        return -1;
                    } else if (a[k] > b[k]) {
                        return 1;
                    }
                }
                return 0;
            })
            : data.sort(function (a: any, b: any): number {
                for (let k of keys) {
                    if (a[k] < b[k]) {
                        return 1;
                    } else if (a[k] > b[k]) {
                        return -1;
                    }
                }
                return 0;
            });
    }

    checkValidity(columnKeys: Array<string>): boolean {
        for (let k of this.keys) {
            if (!columnKeys.includes(k)) {
                return false;
            }
        }
        return true;
    }

}