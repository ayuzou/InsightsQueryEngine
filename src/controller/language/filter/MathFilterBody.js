"use strict";
var ParseUtil_1 = require("../ParseUtil");
var KeyUtil_1 = require("../key/KeyUtil");
var MathFilterBody = (function () {
    function MathFilterBody(mkey, num) {
        this.mkey = mkey;
        this.num = num;
    }
    MathFilterBody.prototype.getMKey = function () {
        return this.mkey;
    };
    MathFilterBody.prototype.getNum = function () {
        return this.num;
    };
    MathFilterBody.parse = function (input) {
        ParseUtil_1.default.checkNumFields(input, 1);
        for (var key in input) {
            if (input.hasOwnProperty(key) && KeyUtil_1.default.isMathKey(key)) {
                if (typeof input[key] === 'number') {
                    return new MathFilterBody(key, input[key]);
                }
                else {
                    throw "cannot find a number type for MathFilterBody.num";
                }
            }
        }
        throw "invalid key found for MathFilterBody";
    };
    return MathFilterBody;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MathFilterBody;
//# sourceMappingURL=MathFilterBody.js.map