"use strict";
var Util_1 = require("../../Util");
var Building = (function () {
    function Building(shortname, fullname, address) {
        this.shortname = shortname;
        this.fullname = fullname;
        this.address = address;
    }
    Building.prototype.getFullName = function () {
        return this.fullname;
    };
    Building.prototype.getShortName = function () {
        return this.shortname;
    };
    Building.prototype.getAddress = function () {
        return this.address;
    };
    Building.prototype.getLat = function () {
        return this.lat;
    };
    Building.prototype.getLon = function () {
        return this.lon;
    };
    Building.prototype.setLatLon = function () {
        var that = this;
        return new Promise(function (fulfill, reject) {
            var url_base = 'http://skaha.cs.ubc.ca:11316/api/v1/team120/';
            var addr = that.address.replace(/ /g, '%20');
            var url = url_base + addr;
            Building.getLocationFromWebService(url).then(function (latlon) {
                that.lat = latlon.lat;
                that.lon = latlon.lon;
                fulfill();
            }).catch(function (err) {
                Util_1.default.error(err);
                reject(err);
            });
        });
    };
    Building.getLocationFromWebService = function (url) {
        var http = require('http');
        return new Promise(function (fulfill, reject) {
            http.get(url, function (res) {
                var status = res.statusCode;
                if (status === 200) {
                    res.setEncoding('utf8');
                    var rawData_1 = '';
                    res.on('data', function (chunk) {
                        rawData_1 += chunk;
                    });
                    res.on('end', function () {
                        try {
                            var parsedData = JSON.parse(rawData_1);
                            fulfill(parsedData);
                        }
                        catch (e) {
                            reject(e.message);
                        }
                    });
                }
                else {
                    reject(status + ': ' + res.statusMessage);
                }
            });
        });
    };
    return Building;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Building;
//# sourceMappingURL=Building.js.map