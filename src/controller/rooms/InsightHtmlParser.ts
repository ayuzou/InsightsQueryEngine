import HtmlNode from "./HtmlNode";
import Building from "./Building";
import BuildingCreator from "./BuildingCreator";
import RoomCreator from "./RoomCreator";
import Room from "./Room";

export default class InsightHtmlParser {

    static getMainDivFromDocument(document: any): any {
        const htmlNode: any = HtmlNode.getHtml(document);
        if (htmlNode !== null) {
            const bodyNode: any = HtmlNode.getBody(htmlNode);
            if (bodyNode !== null) {
                const divs: Array<any> = HtmlNode.getDivs(bodyNode);

                let allDivs: Array<any> = [];
                for (let div of divs) {
                    const divdivs: Array<any> = HtmlNode.getDivs(div);
                    for (let divdiv of divdivs) {
                        allDivs.push(divdiv);
                    }
                }

                return HtmlNode.getMainDiv(allDivs);
            }
        }
        return null;
    }

    static getSectionDivs(document: any): Array<any> {
        const mainDiv: any = InsightHtmlParser.getMainDivFromDocument(document);
        if (mainDiv !== null) {
            const mainDivDivs = HtmlNode.getDivs(mainDiv);
            const mainContent = HtmlNode.getContent(mainDivDivs);
            if (mainContent !== null) {
                const contentSection = HtmlNode.getSection(mainContent);
                if (contentSection !== null) {
                    const sectionDiv = HtmlNode.getDiv(contentSection);
                    if (sectionDiv !== null) {
                        return HtmlNode.getDivs(sectionDiv);
                    }
                }
            }
        }
        return [];
    }

    static getBuildingList(document: any): Array<Building> {
        const sectionDivDivs: Array<any> = InsightHtmlParser.getSectionDivs(document);
        const viewContent = HtmlNode.getViewContent(sectionDivDivs);
        if (viewContent !== null) {
            const table = HtmlNode.getTable(viewContent);
            if (table !== null) {
                return BuildingCreator.parseHtmlTableToBuildings(table);
            }
        }
        return [];
    }

    static getRoomsOfBuilding(building: any, document: any): Array<Room> {
        const sectionDivDivs: Array<any> = InsightHtmlParser.getSectionDivs(document);
        const viewFooter: any = HtmlNode.getViewFooter(sectionDivDivs);
        if (viewFooter !== null) {
            const viewFooterDiv = HtmlNode.getDiv(viewFooter);
            if (viewFooterDiv !== null) {
                const viewFooterDivDivs = HtmlNode.getDivs(viewFooterDiv);
                if (viewFooterDivDivs.length !== 0) {
                    const viewContent = HtmlNode.getViewContent(viewFooterDivDivs);
                    if (viewContent !== null) {
                        const table = HtmlNode.getTable(viewContent);
                        if (table !== null) {
                            return RoomCreator.parseHtmlTableToRooms(building, table);
                        }
                    }
                }
            }
        }
        return [];
    }
}
