"use strict";
var KeyUtil_1 = require("../key/KeyUtil");
var Decimal = require("decimal.js");
var ApplyToken = (function () {
    function ApplyToken(token, key) {
        this.token = token;
        this.key = key;
    }
    ApplyToken.parse = function (input) {
        var keys = Object.keys(input);
        if (keys.length === 1) {
            var token = keys[0];
            ApplyToken.checkTokenValidity(input, token);
            var key = input[token];
            return new ApplyToken(token, key);
        }
        else {
            throw "apply token has more names than expected";
        }
    };
    ApplyToken.checkTokenValidity = function (input, token) {
        var key = input[token];
        switch (token) {
            case 'MAX':
            case 'MIN':
            case 'AVG':
            case 'SUM':
                if (!KeyUtil_1.default.isMathKey(key)) {
                    throw "key: " + key + " does not apply to token: " + token;
                }
                return;
            case 'COUNT':
                if (!KeyUtil_1.default.isValidKey(key)) {
                    throw "key: " + key + "is not a valid key.";
                }
                return;
            default:
                throw "invalid token";
        }
    };
    ApplyToken.prototype.getKey = function () {
        return this.key;
    };
    ApplyToken.prototype.interp = function (data) {
        var key = this.key;
        var raw = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var row = data_1[_i];
            raw.push(row[key]);
        }
        switch (this.token) {
            case 'MAX': return ApplyToken.max(raw);
            case 'MIN': return ApplyToken.min(raw);
            case 'AVG': return Number((raw.map(function (val) { return new Decimal(val); }).reduce(function (a, b) { return a.plus(b); }).toNumber() / data.length).toFixed(2));
            case 'COUNT': return ApplyToken.count(raw);
            case 'SUM': return Number(raw.map(function (val) { return new Decimal(val); }).reduce(function (a, b) { return a.plus(b); }).toNumber().toFixed(2));
        }
    };
    ApplyToken.max = function (data) {
        var m = data[0];
        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
            var x = data_2[_i];
            if (x > m) {
                m = x;
            }
        }
        return m;
    };
    ApplyToken.min = function (data) {
        var m = data[0];
        for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
            var x = data_3[_i];
            if (x < m) {
                m = x;
            }
        }
        return m;
    };
    ApplyToken.count = function (data) {
        data.sort();
        var cnt = 1;
        var x = data[0];
        for (var i = 1; i < data.length; i++) {
            if (x !== data[i]) {
                cnt += 1;
                x = data[i];
            }
        }
        return cnt;
    };
    return ApplyToken;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApplyToken;
//# sourceMappingURL=ApplyToken.js.map