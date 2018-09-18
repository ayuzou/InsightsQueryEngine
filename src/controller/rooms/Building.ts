import Log from "../../Util";
import {IncomingMessage} from "http";

export default class Building {

    private fullname: string;
    private shortname: string;
    private address: string;
    private lat: number;
    private lon: number;

    constructor(shortname: string, fullname: string, address: string) {
        this.shortname = shortname;
        this.fullname = fullname;
        this.address = address;
    }

    getFullName(): string {
        return this.fullname;
    }

    getShortName(): string {
        return this.shortname;
    }

    getAddress(): string {
        return this.address;
    }

    getLat(): number {
        return this.lat;
    }

    getLon(): number {
        return this.lon;
    }

    setLatLon(): Promise<any> {
        const that = this;
        return new Promise(function (fulfill, reject) {
            const url_base: string = 'http://skaha.cs.ubc.ca:11316/api/v1/team120/';
            const addr: string = that.address.replace(/ /g, '%20');
            const url: string = url_base + addr;
            Building.getLocationFromWebService(url).then(function (latlon) {
                that.lat = latlon.lat;
                that.lon = latlon.lon;
                fulfill();
            }).catch(function (err: any) {
                Log.error(err);
                reject(err);
            });
        });
    }

    private static getLocationFromWebService(url: string): Promise<any> {
        // send a request using http module
        const http = require('http');

        return new Promise(function (fulfill, reject) {
            http.get(url, function (res: IncomingMessage) {
                const status = res.statusCode;
                if (status === 200) {
                    res.setEncoding('utf8');
                    let rawData: string = '';

                    res.on('data', function (chunk: any) {
                        rawData += chunk;
                    });

                    res.on('end', function () {
                        try {
                            const parsedData = JSON.parse(rawData);
                            fulfill(parsedData);
                        } catch (e) {
                            reject(e.message);
                        }
                    });
                } else {
                    reject(status + ': ' + res.statusMessage);
                }
            });
        });
    }
}