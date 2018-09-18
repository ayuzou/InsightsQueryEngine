/**
 * This is the main programmatic entry point for the project.
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */

import {IInsightFacade, InsightResponse} from "./IInsightFacade";

import Log from "../Util";
import ZipFileReader from "./ZipFileReader";
import CourseRecordFilter from "./courses/CourseRecordFilter";
import PersistenceLayer from "./PersistenceLayer";
import InsightsQuery from "./language/InsightsQuery";


export default class InsightFacade implements IInsightFacade {

    public static COURSES: string = 'courses';
    public static ROOMS: string = 'rooms';

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            if (id === InsightFacade.COURSES) {
                new ZipFileReader().readCoursesZip(content)
                    .then(function (results: Array<any>) {
                        const recs: Array<any> = CourseRecordFilter.filter(results);
                        InsightFacade.addData(id, recs).then(function (resp: InsightResponse) {
                            fulfill(resp);
                        }).catch(function (errResp: InsightResponse) {
                            reject(errResp);
                        });
                    })
                    .catch(function () {
                        Log.error('Bad courses zip file. Fulfill response with 400.');
                        reject(<InsightResponse>
                            {
                                code: 400,
                                body: { error: 'Error parsing the courses zip file' }
                            }
                        );
                    });
            } else if (id === InsightFacade.ROOMS) {
                new ZipFileReader().readRoomsZip(content)
                    .then(function (rooms: Array<any>) {
                        InsightFacade.addData(id, rooms).then(function (resp: InsightResponse) {
                            fulfill(resp);
                        }).catch(function (errResp: InsightResponse) {
                            reject(errResp);
                        });
                    })
                    .catch(function () {
                        reject(<InsightResponse>
                            {
                                code: 400,
                                body: { error: 'Error parsing the rooms zip file' }
                            }
                        );
                    });
            } else {
                reject(<InsightResponse>
                    {
                        code: 400,
                        body: { error: 'invalid id' }
                    }
                );
            }
        });
    }

    static addData(id: string, data: Array<any>): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            if (data.length === 0) {
                reject(<InsightResponse>
                    {
                        code: 400,
                        body: { error: 'No valid data found in content.'}
                    }
                );
            } else {
                const pl: PersistenceLayer = PersistenceLayer.getInstance();
                if (pl.hasDataset(id)) {
                    pl.update(id, data).then(function () {
                        fulfill(<InsightResponse>
                            {
                                code: 201,
                                body: { message: 'Successfully replace an existing data set.' }
                            }
                        );
                    });
                } else {
                    pl.create(id, data).then(function () {
                        fulfill(<InsightResponse>
                            {
                                code: 204,
                                body: { message: 'Successfully added a new data set.' }
                            }
                        );
                    });
                }
            }
        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            const pl: PersistenceLayer = PersistenceLayer.getInstance();
            if (pl.hasDataset(id)) {
                pl.remove(id).then(function () {
                    fulfill(<InsightResponse>
                        {
                            code : 204,
                            body : { message : 'Successfully removed data set: ' + id }
                        }
                    );
                });
            } else {
                reject(<InsightResponse>
                    {
                        code : 404,
                        body : { error : 'Data set does not exist: ' + id }
                    }
                );
            }
        });
    }

    performQuery(query: any): Promise <InsightResponse> {
        return new Promise(function (fulfill, reject) {
            let insightsQuery: InsightsQuery = null;
            try {
                insightsQuery = InsightsQuery.parse(query);
            } catch (err) {
                reject(<InsightResponse>
                    {
                        code : 400,
                        body : { error : 'Query parsing error: ' + err }
                    }
                );
            }
            if (insightsQuery !== null) {
                const id: string = insightsQuery.getIsCoursesQuery() ?
                    InsightFacade.COURSES : InsightFacade.ROOMS;
                const pl: PersistenceLayer = PersistenceLayer.getInstance();
                if (pl.hasDataset(id)) {
                    const data: Array<any> = pl.loadDataset(id);
                    const result: Array<any>  = insightsQuery.interp(data);
                    fulfill(<InsightResponse>
                        {
                            code: 200,
                            body: { result: result }
                        }
                    );
                } else {
                    Log.warn('Dataset: '+ id + ' not found, return 424.');
                    reject(<InsightResponse>
                        {
                            code : 424,
                            body : { error : 'Query failed because of missing data set.' }
                        }
                    );
                }
            }
        });
    }
}
