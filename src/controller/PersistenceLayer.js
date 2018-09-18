"use strict";
var Util_1 = require("../Util");
var fs = require("fs");
var path = require("path");
var Room_1 = require("./rooms/Room");
var InsightFacade_1 = require("./InsightFacade");
var Course_1 = require("./courses/Course");
var PersistenceLayer = (function () {
    function PersistenceLayer() {
        this.data = {};
        if (fs.existsSync(PersistenceLayer.DIR_PATH)) {
            for (var _i = 0, _a = fs.readdirSync(PersistenceLayer.DIR_PATH); _i < _a.length; _i++) {
                var name_1 = _a[_i];
                var filePath = PersistenceLayer.DIR_PATH + name_1;
                this.data[name_1] = JSON.parse(fs.readFileSync(filePath).toString());
            }
        }
    }
    PersistenceLayer.createDirIfNotExist = function () {
        if (!fs.existsSync(PersistenceLayer.DIR_PATH)) {
            fs.mkdirSync(PersistenceLayer.DIR_PATH);
        }
    };
    PersistenceLayer.getInstance = function () {
        if (!PersistenceLayer.instance) {
            PersistenceLayer.instance = new PersistenceLayer();
        }
        return PersistenceLayer.instance;
    };
    PersistenceLayer.prototype.hasDataset = function (id) {
        Util_1.default.info('checking existence of data set: ' + id);
        if (this.data.hasOwnProperty(id)) {
            Util_1.default.info('data set found: ' + id);
            return true;
        }
        else {
            PersistenceLayer.createDirIfNotExist();
            return fs.existsSync(PersistenceLayer.DIR_PATH + id);
        }
    };
    PersistenceLayer.prototype.update = function (id, content) {
        var that = this;
        return new Promise(function (fulfill) {
            that.data[id] = content;
            Util_1.default.info('Replace existing file: ' + id);
            var path = PersistenceLayer.DIR_PATH + id;
            fs.truncateSync(path, 0);
            fs.writeFileSync(path, JSON.stringify(content));
            fulfill();
        });
    };
    PersistenceLayer.prototype.create = function (id, content) {
        var that = this;
        return new Promise(function (fulfill) {
            that.data[id] = content;
            Util_1.default.info('Writing a new file: ' + id);
            PersistenceLayer.createDirIfNotExist();
            fs.writeFileSync(PersistenceLayer.DIR_PATH + id, JSON.stringify(content));
            fulfill();
        });
    };
    PersistenceLayer.prototype.remove = function (id) {
        var that = this;
        return new Promise(function (fulfill) {
            delete that.data[id];
            fs.unlinkSync(PersistenceLayer.DIR_PATH + id);
            fulfill();
        });
    };
    PersistenceLayer.prototype.clearAll = function () {
        this.data = {};
        if (fs.existsSync(PersistenceLayer.DIR_PATH)) {
            var files = fs.readdirSync(PersistenceLayer.DIR_PATH);
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                var filePath = PersistenceLayer.DIR_PATH + file;
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                }
            }
            fs.rmdirSync(PersistenceLayer.DIR_PATH);
        }
    };
    PersistenceLayer.prototype.loadDataset = function (id) {
        var data = this.data[id];
        return id === InsightFacade_1.default.COURSES ?
            Course_1.default.restore(data) : Room_1.default.restore(data);
    };
    return PersistenceLayer;
}());
PersistenceLayer.DIR_PATH = path.join(__dirname, 'data/');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PersistenceLayer;
//# sourceMappingURL=PersistenceLayer.js.map