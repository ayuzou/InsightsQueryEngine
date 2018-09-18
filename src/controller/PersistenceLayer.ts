/**
 * Persistence Layer.
 *
 * @author Ayumi Imaizumi, Ziyang Jin
 */

import Log from "../Util";
import * as fs from 'fs';
import * as path from 'path';
import Room from "./rooms/Room";
import InsightFacade from "./InsightFacade";
import Course from "./courses/Course";

export default class PersistenceLayer {

    private static instance: PersistenceLayer;

    // data is like
    // {
    //   "courses" : [[...], [...], [...]]
    //   "id2" : [[...], [...], [...]]
    // }
    private data: any;

    private static DIR_PATH: string = path.join(__dirname, 'data/');

    private constructor() {
        this.data = {};
        if (fs.existsSync(PersistenceLayer.DIR_PATH)) {
            for (let name of fs.readdirSync(PersistenceLayer.DIR_PATH)) {
                const filePath: string = PersistenceLayer.DIR_PATH + name;
                this.data[name] = JSON.parse(fs.readFileSync(filePath).toString());
            }
        }
    }

    private static createDirIfNotExist(): void {
        if (!fs.existsSync(PersistenceLayer.DIR_PATH)) {
            fs.mkdirSync(PersistenceLayer.DIR_PATH);
        }
    }

    static getInstance() {
        if (!PersistenceLayer.instance) {
            PersistenceLayer.instance = new PersistenceLayer();
        }
        return PersistenceLayer.instance;
    }

    /**
     * check if a data set already exists as a file
     *
     * @param {string} id
     * @returns {boolean}
     */
    hasDataset(id: string): boolean {
        Log.info('checking existence of data set: ' + id);
        if (this.data.hasOwnProperty(id)) {
            Log.info('data set found: ' + id);
            return true;
        } else {
            PersistenceLayer.createDirIfNotExist();
            return fs.existsSync(PersistenceLayer.DIR_PATH + id)
        }
    }

    /**
     * Replace the content of file 'id' with its new content.
     * Pre-condition: the file already exists in the data set.
     *
     * @param {string} id
     * @param {Array<any>} content
     * @returns {Promise<any>}
     */
    update(id: string, content: Array<any>): Promise<any> {
        const that = this;
        return new Promise(function (fulfill) {
            that.data[id] = content;
            Log.info('Replace existing file: ' + id);
            const path: string = PersistenceLayer.DIR_PATH + id;
            fs.truncateSync(path,0);
            fs.writeFileSync(path, JSON.stringify(content));
            fulfill();
        });
    }

    /**
     * Create a new file with its id and content.
     *
     * @param {string} id
     * @param {Array<any>} content
     * @returns {Promise<any>}
     */
    create(id: string, content: Array<any>): Promise<any> {
        const that = this;
        return new Promise(function (fulfill) {
            that.data[id] = content;
            Log.info('Writing a new file: ' + id);
            PersistenceLayer.createDirIfNotExist();
            fs.writeFileSync(PersistenceLayer.DIR_PATH + id, JSON.stringify(content));
            fulfill();
        });
    }

    /**
     * Delete the file if the data set with id exists.
     * Pre-condition: the id already exists
     *
     * @param {string} id
     * @returns {Promise<any>}
     */
    remove(id: string): Promise<any> {
        const that = this;
        return new Promise(function (fulfill) {
            delete that.data[id];
            fs.unlinkSync(PersistenceLayer.DIR_PATH + id);
            fulfill();
        });
    }

    /**
     * Clears all the dataset
     */
    clearAll(): void {
        this.data = {};
        if (fs.existsSync(PersistenceLayer.DIR_PATH)) {
            const files: Array<string> = fs.readdirSync(PersistenceLayer.DIR_PATH);
            for (let file of files) {
                const filePath: string = PersistenceLayer.DIR_PATH + file;
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                }
            }
            fs.rmdirSync(PersistenceLayer.DIR_PATH);
        }
    }

    /**
     * Return the data set given the data set id
     * Pre-condition: data set is a valid data set and can be parsed to json
     *
     * @param {string} id
     * @returns {Array<any>}
     */
    loadDataset(id: string): Array<any> {
        const data: Array<Array<any>> = this.data[id];
        // return a new copy of the data
        return id === InsightFacade.COURSES ?
            Course.restore(data) : Room.restore(data);
    }

}