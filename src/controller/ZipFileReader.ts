/**
 * Reader to read the content as a zip file.
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */

import Log from "../Util";
import Building from "./rooms/Building";
import Room from "./rooms/Room";
import InsightHtmlParser from "./rooms/InsightHtmlParser";
const JSZip = require('jszip');
const parse5 = require('parse5');

export default class ZipFileReader {

    readCoursesZip(content: string): Promise<Array<any>> {
        return new Promise(function (fulfill, reject) {

            JSZip.loadAsync(content, { base64 : true })
                .then(function (zip: any) {

                    const proms: Array<Promise<any>> = [];
                    zip.forEach(function (relativePath: string, file: JSZipObject) {
                        if (!file.dir) {
                            proms.push(file.async('string')
                                .then(function (text: string) {
                                    try {
                                        return JSON.parse(text);
                                    } catch (err) {
                                        Log.error('Error parsing single file text:' + err);
                                        Log.error('Skip this file.');
                                        return null;
                                    }
                                })
                            );
                        }
                    });

                    Promise.all(proms)
                        .then(function (results: Array<any>) {
                            const recs: Array<any> = [];
                            for (let rec of results) {
                                if (rec !== null) {
                                    recs.push(rec);
                                }
                            }
                            fulfill(recs);
                        })
                        .catch(function (err: any) {
                            reject(err);
                        });

                })
                .catch(function (err: any) {
                    Log.error('Error reading the initial zip file: ' + err);
                    reject('Bad courses zip file.');
                });

        });
    }

    readRoomsZip(content: string): Promise<Array<any>> {
        return new Promise(function (fulfill, reject) {

            JSZip.loadAsync(content, { base64 : true })
                .then(function (zip :any) {
                    ZipFileReader.getBuildingsListFromIndex(zip)
                        .then(function (buildings: Array<Building>) {
                            const proms: Array<Promise<any>> = [];
                            for (let building of buildings) {
                                const shortname: string = building.getShortName();
                                const filePath: string = 'campus/discover/buildings-and-classrooms/' + shortname;
                                const file: any = zip.file(filePath);
                                proms.push(file.async('string').then(function (result: any) {
                                    return {
                                        building: building,
                                        document: parse5.parse(result)
                                    };
                                }));
                            }

                            Promise.all(proms).then(function (results: Array<any>) {
                                const lst: Array<any> = [];
                                for (let result of results) {
                                    const rms: Array<Room> = InsightHtmlParser.getRoomsOfBuilding(result.building, result.document);
                                    for (let rm of rms) {
                                        lst.push(rm.createRoomRecord());
                                    }
                                }
                                fulfill(lst);
                            }).catch(function (err: any) {
                                reject(err);
                            });
                        })
                        .catch(function (err: any) {
                            reject(err);
                        });
                })
                .catch(function () {
                    reject('Bad rooms zip file.');
                });

        });
    }

    static getBuildingsListFromIndex(zip: any): Promise<Array<Building>> {
        return new Promise(function (fulfill, reject) {
            const ind: any = zip.file('index.htm');
            if (ind === null) {
                reject('index.htm does not exist in the given zip file.');
            } else {
                ind.async('string').then(function (result: string) {
                    const bds: Array<Building> = InsightHtmlParser.getBuildingList(parse5.parse(result));

                    const proms: Array<Promise<any>> = [];
                    for (let b of bds) {
                        proms.push(b.setLatLon());
                    }

                    Promise.all(proms).then(function () {
                        fulfill(bds);
                    }).catch(function (err: any) {
                        reject(err);
                    });

                }).catch(function (err: any) {
                    reject(err);
                });
            }
        });
    }

}
