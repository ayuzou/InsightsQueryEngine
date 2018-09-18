import HtmlNode from "./HtmlNode";
import Room from "./Room";
import Building from "./Building";

export default class RoomCreator {

    private static getRoomNumber(tdata: any): string {
        return HtmlNode.getInnerANodeTextNodeValue(tdata[0]);
    }

    private static getRoomSeats(tdata: any): number {
        const seats: string = HtmlNode.getInnerTextValue(tdata[1]);
        return parseInt(seats, 10);
    }

    private static getRoomFurniture(tdata: any): string {
        return HtmlNode.getInnerTextValue(tdata[2]);
    }

    private static getRoomType(tdata: any): string {
        return HtmlNode.getInnerTextValue(tdata[3]);
    }

    static parseHtmlTableToRooms(building: any, table: any): Array<Room> {
        const rows: any = HtmlNode.getTableRows(table);
        const rms: Array<Room> = [];
        for (let row of rows) {
            const td: Array<any> = HtmlNode.getTableData(row);
            rms.push(RoomCreator.createRoom(building, td));
        }
        return rms;
    }

    private static createRoom(b: Building, td: any): Room {
        return new Room(
            b.getFullName(),
            b.getShortName(),
            RoomCreator.getRoomNumber(td),
            b.getAddress(),
            b.getLat(),
            b.getLon(),
            RoomCreator.getRoomSeats(td),
            RoomCreator.getRoomType(td),
            RoomCreator.getRoomFurniture(td));
    }

}