"use strict";
var HtmlNode_1 = require("./HtmlNode");
var Building_1 = require("./Building");
var BuildingCreator = (function () {
    function BuildingCreator() {
    }
    BuildingCreator.getShortName = function (tdata) {
        return HtmlNode_1.default.getInnerTextValue(tdata[1]);
    };
    BuildingCreator.getFullName = function (tdata) {
        return HtmlNode_1.default.getInnerANodeTextNodeValue(tdata[2]);
    };
    BuildingCreator.getAddress = function (tdata) {
        return HtmlNode_1.default.getInnerTextValue(tdata[3]);
    };
    BuildingCreator.parseHtmlTableToBuildings = function (table) {
        var rows = HtmlNode_1.default.getTableRows(table);
        var bds = [];
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            var td = HtmlNode_1.default.getTableData(row);
            bds.push(BuildingCreator.createBuilding(td));
        }
        return bds;
    };
    BuildingCreator.createBuilding = function (td) {
        return new Building_1.default(BuildingCreator.getShortName(td), BuildingCreator.getFullName(td), BuildingCreator.getAddress(td));
    };
    return BuildingCreator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BuildingCreator;
//# sourceMappingURL=BuildingCreator.js.map