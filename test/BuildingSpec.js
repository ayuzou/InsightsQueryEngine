"use strict";
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var Building_1 = require("../src/controller/rooms/Building");
describe('building', function () {
    it('test sending request', function () {
        var building = new Building_1.default('DMP', 'Hugh Dempster Pavilion', '6245 Agronomy Road V6T 1Z4');
        return building.setLatLon()
            .then(function () {
            chai_1.expect(building.getLat()).to.equal(49.26125);
            chai_1.expect(building.getLon()).to.equal(-123.24807);
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it('test sending request', function () {
        var building = new Building_1.default('DMP', 'Hugh Dempster Pavilion', 'One Hacker Way');
        return building.setLatLon()
            .then(function () {
            chai_1.expect.fail();
        })
            .catch(function (err) {
            Util_1.default.info(err);
        });
    });
});
//# sourceMappingURL=BuildingSpec.js.map