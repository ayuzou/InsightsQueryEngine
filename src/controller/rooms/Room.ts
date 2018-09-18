export default class Room {

    // rooms_fullname: string; Full building name (e.g., "Hugh Dempster Pavilion").
    // rooms_shortname: string; Short building name (e.g., "DMP").
    // rooms_number: string; The room number. Not always a number, so represented as a string.
    // rooms_name: string; The room id; should be rooms_shortname+"_"+rooms_number.
    // rooms_address: string; The building address. (e.g., "6245 Agronomy Road V6T 1Z4").
    // rooms_lat: number; The latitude of the building. Instructions for getting this field are below.
    // rooms_lon: number; The longitude of the building. Instructions for getting this field are below.
    // rooms_seats: number; The number of seats in the room.
    // rooms_type: string; The room type (e.g., "Small Group").
    // rooms_furniture: string; The room type (e.g., "Classroom-Movable Tables & Chairs").
    // rooms_href: string; The link to full details online (e.g., "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201").

    private fullname: string;
    private shortname: string;
    private number: string;
    private name: string;
    private address: string;
    private lat: number;
    private lon: number;
    private seats: number;
    private type: string;
    private furniture: string;
    private href: string;
    private static BASE_URL: string = 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/';

    constructor(fullname: string, shortname: string, number: string,
                address: string, lat: number, lon: number,
                seats: number, type: string, furniture: string) {
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

    createRoomRecord(): Array<any> {
        return [
            this.fullname,  // 0
            this.shortname, // 1
            this.number,    // 2
            this.name,      // 3
            this.address,   // 4
            this.lat,       // 5
            this.lon,       // 6
            this.seats,     // 7
            this.type,      // 8
            this.furniture, // 9
            this.href       // 10
        ];
    }

    static restore(data: Array<any>): Array<any> {
        const result: Array<any> = [];
        for (let r of data) {
            result.push(
                {
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
                }
            );
        }
        return result;
    }

}