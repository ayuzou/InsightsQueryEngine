import {IQueryFilter} from "./IQueryFilter";
import ParseUtil from "../ParseUtil";
import {WayOfSearch} from "./WayOfSearch";
import Key from "../key/Key";

export default class StringFilter implements IQueryFilter {

    private wos: WayOfSearch;
    private skey: string;
    private word: string;

    constructor(wayOfSearch: WayOfSearch, skey: string, inputstring: string) {
        this.wos = wayOfSearch;
        this.skey = skey;
        this.word = inputstring;
    }

    getAllKeys(): Array<string> {
        return [this.skey];
    }

    static parse(input: any): StringFilter {
        ParseUtil.checkNumFields(input, 1);
        for (let k of Key.stringKeys) {
            if (input.hasOwnProperty(k)) {
                if (typeof input[k] === 'string') {
                    const wayOfSearch: WayOfSearch = StringFilter.findWayOfSearch(input[k]);
                    return new StringFilter(wayOfSearch, k,
                        StringFilter.addInputString(input[k], wayOfSearch));
                } else {
                    throw "cannot find string type for StringFilter.inputstring";
                }
            }
        }
        throw "no valid key for StringFilter";
    }

    /**
     * inputstring:  Matches inputstring exactly
     * *inputstring:  Ends with inputstring
     * inputstring*: Starts with inputstring
     * *inputstring*: Contains inputstring
     */
    static findWayOfSearch(s: string): WayOfSearch {
        if (s === '' || s === '*') {
            throw 'invalid string for inputstring in StringFilter';
        }

        const ls: boolean = s.charAt(0) === '*';
        const rs: boolean = s.charAt(s.length-1) === '*';
        if (ls && rs) {
            return WayOfSearch.CONTAINS;
        } else if (ls) {
            return WayOfSearch.END_WITH;
        } else if (rs) {
            return WayOfSearch.START_WITH;
        } else {
            return WayOfSearch.MATCH;
        }
    }

    static addInputString(s: string, wayOfSearch: WayOfSearch): string {
        let res: string = '';
        switch (wayOfSearch) {
            case WayOfSearch.START_WITH:
                res = s.substring(0, s.length-1);
                break;
            case WayOfSearch.END_WITH:
                res = s.substring(1);
                break;
            case WayOfSearch.CONTAINS:
                res = s.substring(1, s.length-1);
                break;
            case WayOfSearch.MATCH:
                res = s;
                break;
        }
        if (res === '' || res.includes('*')) {
            throw 'invalid string for inputstring in StringFilter';
        }
        return res;
    }

    interp(data: Array<any>): Array<any> {
        const skey: string = this.skey;
        const r: Array<any> = [];
        for (let row of data) {
            const s: string = row[skey];
            switch (this.wos) {
                case WayOfSearch.START_WITH:
                    if (s.startsWith(this.word)) {
                        r.push(row);
                    }
                    break;
                case WayOfSearch.END_WITH:
                    if (s.endsWith(this.word)) {
                        r.push(row);
                    }
                    break;
                case WayOfSearch.CONTAINS:
                    if (s.indexOf(this.word) !== -1) {
                        r.push(row);
                    }
                    break;
                case WayOfSearch.MATCH:
                    if (s === this.word) {
                        r.push(row);
                    }
                    break;
            }
        }
        return r;
    }
}