"use strict";
var ParseUtil_1 = require("../ParseUtil");
var WayOfSearch_1 = require("./WayOfSearch");
var Key_1 = require("../key/Key");
var StringFilter = (function () {
    function StringFilter(wayOfSearch, skey, inputstring) {
        this.wos = wayOfSearch;
        this.skey = skey;
        this.word = inputstring;
    }
    StringFilter.prototype.getAllKeys = function () {
        return [this.skey];
    };
    StringFilter.parse = function (input) {
        ParseUtil_1.default.checkNumFields(input, 1);
        for (var _i = 0, _a = Key_1.default.stringKeys; _i < _a.length; _i++) {
            var k = _a[_i];
            if (input.hasOwnProperty(k)) {
                if (typeof input[k] === 'string') {
                    var wayOfSearch = StringFilter.findWayOfSearch(input[k]);
                    return new StringFilter(wayOfSearch, k, StringFilter.addInputString(input[k], wayOfSearch));
                }
                else {
                    throw "cannot find string type for StringFilter.inputstring";
                }
            }
        }
        throw "no valid key for StringFilter";
    };
    StringFilter.findWayOfSearch = function (s) {
        if (s === '' || s === '*') {
            throw 'invalid string for inputstring in StringFilter';
        }
        var ls = s.charAt(0) === '*';
        var rs = s.charAt(s.length - 1) === '*';
        if (ls && rs) {
            return WayOfSearch_1.WayOfSearch.CONTAINS;
        }
        else if (ls) {
            return WayOfSearch_1.WayOfSearch.END_WITH;
        }
        else if (rs) {
            return WayOfSearch_1.WayOfSearch.START_WITH;
        }
        else {
            return WayOfSearch_1.WayOfSearch.MATCH;
        }
    };
    StringFilter.addInputString = function (s, wayOfSearch) {
        var res = '';
        switch (wayOfSearch) {
            case WayOfSearch_1.WayOfSearch.START_WITH:
                res = s.substring(0, s.length - 1);
                break;
            case WayOfSearch_1.WayOfSearch.END_WITH:
                res = s.substring(1);
                break;
            case WayOfSearch_1.WayOfSearch.CONTAINS:
                res = s.substring(1, s.length - 1);
                break;
            case WayOfSearch_1.WayOfSearch.MATCH:
                res = s;
                break;
        }
        if (res === '' || res.includes('*')) {
            throw 'invalid string for inputstring in StringFilter';
        }
        return res;
    };
    StringFilter.prototype.interp = function (data) {
        var skey = this.skey;
        var r = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var row = data_1[_i];
            var s = row[skey];
            switch (this.wos) {
                case WayOfSearch_1.WayOfSearch.START_WITH:
                    if (s.startsWith(this.word)) {
                        r.push(row);
                    }
                    break;
                case WayOfSearch_1.WayOfSearch.END_WITH:
                    if (s.endsWith(this.word)) {
                        r.push(row);
                    }
                    break;
                case WayOfSearch_1.WayOfSearch.CONTAINS:
                    if (s.indexOf(this.word) !== -1) {
                        r.push(row);
                    }
                    break;
                case WayOfSearch_1.WayOfSearch.MATCH:
                    if (s === this.word) {
                        r.push(row);
                    }
                    break;
            }
        }
        return r;
    };
    return StringFilter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StringFilter;
//# sourceMappingURL=StringFilter.js.map