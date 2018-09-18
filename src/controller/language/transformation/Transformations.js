"use strict";
var Group_1 = require("./Group");
var Apply_1 = require("./Apply");
var KeyUtil_1 = require("../key/KeyUtil");
var Transformations = (function () {
    function Transformations(group, apply) {
        this.group = group;
        this.apply = apply;
    }
    Transformations.parse = function (input) {
        Transformations.checkProperties(input);
        var group = Group_1.default.parse(input[Transformations.GROUP]);
        var apply = Apply_1.default.parse(input[Transformations.APPLY]);
        return new Transformations(group, apply);
    };
    Transformations.checkProperties = function (input) {
        var keys = Object.keys(input);
        if (keys.length === 2 &&
            keys.includes(Transformations.GROUP) && keys.includes(Transformations.APPLY)) {
            return;
        }
        else {
            throw "tranformation does not have group and apply";
        }
    };
    Transformations.prototype.getAllKeys = function () {
        var res = [];
        KeyUtil_1.default.put(res, this.group.getAllKeys());
        KeyUtil_1.default.put(res, this.apply.getAllKeys());
        return res;
    };
    Transformations.prototype.getDisplayKeys = function () {
        var res = [];
        KeyUtil_1.default.put(res, this.group.getAllKeys());
        KeyUtil_1.default.put(res, this.apply.getNames());
        return res;
    };
    Transformations.prototype.interp = function (data) {
        var res = this.group.interp(data);
        return this.apply.interp(res);
    };
    return Transformations;
}());
Transformations.GROUP = 'GROUP';
Transformations.APPLY = 'APPLY';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Transformations;
//# sourceMappingURL=Transformations.js.map