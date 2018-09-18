"use strict";
var HtmlNode_1 = require("./HtmlNode");
var Room_1 = require("./Room");
var RoomCreator = (function () {
    function RoomCreator() {
    }
    RoomCreator.getRoomNumber = function (tdata) {
        return HtmlNode_1.default.getInnerANodeTextNodeValue(tdata[0]);
    };
    RoomCreator.getRoomSeats = function (tdata) {
        var seats = HtmlNode_1.default.getInnerTextValue(tdata[1]);
        return parseInt(seats, 10);
    };
    RoomCreator.getRoomFurniture = function (tdata) {
        return HtmlNode_1.default.getInnerTextValue(tdata[2]);
    };
    RoomCreator.getRoomType = function (tdata) {
        return HtmlNode_1.default.getInnerTextValue(tdata[3]);
    };
    RoomCreator.parseHtmlTableToRooms = function (building, table) {
        var rows = HtmlNode_1.default.getTableRows(table);
        var rms = [];
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            var td = HtmlNode_1.default.getTableData(row);
            rms.push(RoomCreator.createRoom(building, td));
        }
        return rms;
    };
    RoomCreator.createRoom = function (b, td) {
        return new Room_1.default(b.getFullName(), b.getShortName(), RoomCreator.getRoomNumber(td), b.getAddress(), b.getLat(), b.getLon(), RoomCreator.getRoomSeats(td), RoomCreator.getRoomType(td), RoomCreator.getRoomFurniture(td));
    };
    return RoomCreator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoomCreator;
//# sourceMappingURL=RoomCreator.js.map