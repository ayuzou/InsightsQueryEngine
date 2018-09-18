"use strict";
var Room = (function () {
    function Room(fullname, shortname, number, address, lat, lon, seats, type, furniture) {
        this.fullname = fullname;
        this.shortname = shortname;
        this.number = number;
        this.name = shortname + '_' + number;
        this.address = address;
        this.lat = lat;
        this.lon = lon;
        this.seats = seats;
        this.type = type;
        this.furniture = furniture;
        this.href = Room.BASE_URL + shortname + '-' + number;
    }
    Room.prototype.createRoomRecord = function () {
        return [
            this.fullname,
            this.shortname,
            this.number,
            this.name,
            this.address,
            this.lat,
            this.lon,
            this.seats,
            this.type,
            this.furniture,
            this.href
        ];
    };
    Room.restore = function (data) {
        var result = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var r = data_1[_i];
            result.push({
                'rooms_fullname': r[0],
                'rooms_shortname': r[1],
                'rooms_number': r[2],
                'rooms_name': r[3],
                'rooms_address': r[4],
                'rooms_lat': r[5],
                'rooms_lon': r[6],
                'rooms_seats': r[7],
                'rooms_type': r[8],
                'rooms_furniture': r[9],
                'rooms_href': r[10]
            });
        }
        return result;
    };
    return Room;
}());
Room.BASE_URL = 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Room;
//# sourceMappingURL=Room.js.map