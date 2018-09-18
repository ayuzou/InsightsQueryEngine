"use strict";
var GroupedEntity = (function () {
    function GroupedEntity(id) {
        this.id = id;
        this.content = [];
    }
    GroupedEntity.prototype.addContent = function (r) {
        this.content.push(r);
    };
    GroupedEntity.prototype.getId = function () {
        return this.id;
    };
    GroupedEntity.prototype.getContent = function () {
        return this.content;
    };
    GroupedEntity.prototype.same = function (id) {
        var keys = Object.keys(this.id);
        if (keys.length !== Object.keys(id).length) {
            return false;
        }
        else {
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (this.id[key] !== id[key]) {
                    return false;
                }
            }
            return true;
        }
    };
    return GroupedEntity;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GroupedEntity;
//# sourceMappingURL=GroupedEntity.js.map