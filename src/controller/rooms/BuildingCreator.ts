import HtmlNode from "./HtmlNode";
import Building from "./Building";

export default class BuildingCreator {

    private static getShortName(tdata: Array<any>): string {
        return HtmlNode.getInnerTextValue(tdata[1]);
    }

    private static getFullName(tdata: Array<any>): string {
        return HtmlNode.getInnerANodeTextNodeValue(tdata[2]);
    }

    private static getAddress(tdata: Array<any>): string {
        return HtmlNode.getInnerTextValue(tdata[3]);
    }

    static parseHtmlTableToBuildings(table: any): Array<Building> {
        const rows = HtmlNode.getTableRows(table);
        const bds: Array<Building> = [];
        for (let row of rows) {
            const td: Array<any> = HtmlNode.getTableData(row);
            bds.push(BuildingCreator.createBuilding(td));
        }
        return bds;
    }

    private static createBuilding(td: any): Building {
        return new Building(
            BuildingCreator.getShortName(td),
            BuildingCreator.getFullName(td),
            BuildingCreator.getAddress(td)
        );
    }

}