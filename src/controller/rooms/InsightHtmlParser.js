"use strict";
var HtmlNode_1 = require("./HtmlNode");
var BuildingCreator_1 = require("./BuildingCreator");
var RoomCreator_1 = require("./RoomCreator");
var InsightHtmlParser = (function () {
    function InsightHtmlParser() {
    }
    InsightHtmlParser.getMainDivFromDocument = function (document) {
        var htmlNode = HtmlNode_1.default.getHtml(document);
        if (htmlNode !== null) {
            var bodyNode = HtmlNode_1.default.getBody(htmlNode);
            if (bodyNode !== null) {
                var divs = HtmlNode_1.default.getDivs(bodyNode);
                var allDivs = [];
                for (var _i = 0, divs_1 = divs; _i < divs_1.length; _i++) {
                    var div = divs_1[_i];
                    var divdivs = HtmlNode_1.default.getDivs(div);
                    for (var _a = 0, divdivs_1 = divdivs; _a < divdivs_1.length; _a++) {
                        var divdiv = divdivs_1[_a];
                        allDivs.push(divdiv);
                    }
                }
                return HtmlNode_1.default.getMainDiv(allDivs);
            }
        }
        return null;
    };
    InsightHtmlParser.getSectionDivs = function (document) {
        var mainDiv = InsightHtmlParser.getMainDivFromDocument(document);
        if (mainDiv !== null) {
            var mainDivDivs = HtmlNode_1.default.getDivs(mainDiv);
            var mainContent = HtmlNode_1.default.getContent(mainDivDivs);
            if (mainContent !== null) {
                var contentSection = HtmlNode_1.default.getSection(mainContent);
                if (contentSection !== null) {
                    var sectionDiv = HtmlNode_1.default.getDiv(contentSection);
                    if (sectionDiv !== null) {
                        return HtmlNode_1.default.getDivs(sectionDiv);
                    }
                }
            }
        }
        return [];
    };
    InsightHtmlParser.getBuildingList = function (document) {
        var sectionDivDivs = InsightHtmlParser.getSectionDivs(document);
        var viewContent = HtmlNode_1.default.getViewContent(sectionDivDivs);
        if (viewContent !== null) {
            var table = HtmlNode_1.default.getTable(viewContent);
            if (table !== null) {
                return BuildingCreator_1.default.parseHtmlTableToBuildings(table);
            }
        }
        return [];
    };
    InsightHtmlParser.getRoomsOfBuilding = function (building, document) {
        var sectionDivDivs = InsightHtmlParser.getSectionDivs(document);
        var viewFooter = HtmlNode_1.default.getViewFooter(sectionDivDivs);
        if (viewFooter !== null) {
            var viewFooterDiv = HtmlNode_1.default.getDiv(viewFooter);
            if (viewFooterDiv !== null) {
                var viewFooterDivDivs = HtmlNode_1.default.getDivs(viewFooterDiv);
                if (viewFooterDivDivs.length !== 0) {
                    var viewContent = HtmlNode_1.default.getViewContent(viewFooterDivDivs);
                    if (viewContent !== null) {
                        var table = HtmlNode_1.default.getTable(viewContent);
                        if (table !== null) {
                            return RoomCreator_1.default.parseHtmlTableToRooms(building, table);
                        }
                    }
                }
            }
        }
        return [];
    };
    return InsightHtmlParser;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InsightHtmlParser;
//# sourceMappingURL=InsightHtmlParser.js.map