"use strict";
var ApplyToken_1 = require("./ApplyToken");
var ApplyKey = (function () {
    function ApplyKey(name, token) {
        this.name = name;
        this.token = token;
    }
    ApplyKey.parse = function (input) {
        var keys = Object.keys(input);
        if (keys.length === 1) {
            var name_1 = keys[0];
            ApplyKey.checkUnderScroll(name_1);
            return new ApplyKey(name_1, ApplyToken_1.default.parse(input[name_1]));
        }
        else {
            throw "apply key has more than one name";
        }
    };
    ApplyKey.checkUnderScroll = function (key) {
        if (key.indexOf('_') !== -1) {
            throw "apply key contains the '_' character";
        }
    };
    ApplyKey.prototype.getKey = function () {
        return this.token.getKey();
    };
    ApplyKey.prototype.getName = function () {
        return this.name;
    };
    ApplyKey.prototype.interp = function (data) {
        return this.token.interp(data);
    };
    return ApplyKey;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApplyKey;
//# sourceMappingURL=ApplyKey.js.map