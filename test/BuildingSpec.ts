import {expect} from 'chai';
import Log from "../src/Util";
import Building from "../src/controller/rooms/Building";

describe('building', function() {
    it('test sending request', function () {
        const building = new Building('DMP', 'Hugh Dempster Pavilion', '6245 Agronomy Road V6T 1Z4');
        return building.setLatLon()
            .then(function () {
                expect(building.getLat()).to.equal(49.26125);
                expect(building.getLon()).to.equal(-123.24807);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it('test sending request', function () {
        const building = new Building('DMP', 'Hugh Dempster Pavilion', 'One Hacker Way');
        return building.setLatLon()
            .then(function () {
                expect.fail();
            })
            .catch(function (err: any) {
                Log.info(err);
            });
    });
});