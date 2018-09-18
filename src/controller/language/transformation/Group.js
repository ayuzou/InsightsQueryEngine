"use strict";
var KeyUtil_1 = require("../key/KeyUtil");
var GroupedEntity_1 = require("./GroupedEntity");
var Group = (function () {
    function Group(keys) {
        this.keys = keys;
    }
    Group.parse = function (input) {
        if (Array.isArray(input) && input.length > 0 && KeyUtil_1.default.areValidKeys(input)) {
            return new Group(input);
        }
        else {
            throw "group keys are not an array or empty or not valid";
        }
    };
    Group.prototype.getAllKeys = function () {
        return this.keys;
    };
    Group.prototype.interp = function (data) {
        if (data.length === 0) {
            return [];
        }
        else {
            var keys_1 = this.keys;
            data.sort(function (a, b) {
                for (var _i = 0, keys_2 = keys_1; _i < keys_2.length; _i++) {
                    var k = keys_2[_i];
                    if (a[k] < b[k]) {
                        return -1;
                    }
                    else if (a[k] > b[k]) {
                        return 1;
                    }
                }
                return 0;
            });
            var grp0 = new GroupedEntity_1.default(Group.cmpId(data[0], keys_1));
            grp0.addContent(data[0]);
            var res = [grp0];
            var curr = grp0;
            for (var i = 1; i < data.length; i++) {
                var a = data[i];
                var id = Group.cmpId(a, keys_1);
                if (curr.same(id)) {
                    curr.addContent(a);
                }
                else {
                    var grp1 = new GroupedEntity_1.default(id);
                    grp1.addContent(a);
                    res.push(grp1);
                    curr = grp1;
                }
            }
            return res;
        }
    };
    Group.cmpId = function (rec, keys) {
        var id = {};
        for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
            var key = keys_3[_i];
            id[key] = rec[key];
        }
        return id;
    };
    return Group;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Group;
//# sourceMappingURL=Group.js.map