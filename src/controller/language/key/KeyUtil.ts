import Key from "./Key";

export default class KeyUtil {

    static isCoursesKey(key: string): boolean {
        return Key.courseKeys.includes(key);
    }

    static areAllCourses(keys: Array<string>): boolean {
        for (let key of keys) {
            if (!KeyUtil.isCoursesKey(key)) {
                return false;
            }
        }
        return true;
    }

    static isRoomsKey(key: string): boolean {
        return Key.roomKeys.includes(key);
    }

    static areAllRooms(keys: Array<string>): boolean {
        for (let key of keys) {
            if (!KeyUtil.isRoomsKey(key)) {
                return false;
            }
        }
        return true;
    }

    static isValidKey(k: string): boolean {
        return Key.validKeys.includes(k);
    }

    static areValidKeys(keys: Array<string>): boolean {
        return KeyUtil.areAllCourses(keys) || KeyUtil.areAllRooms(keys);
    }

    static isMathKey(key: string): boolean {
        return Key.mathKeys.includes(key);
    }

    static isStringKey(key: string): boolean {
        return Key.stringKeys.includes(key);
    }

    static put(res: Array<string>, keys: Array<string>) {
        for (let key of keys) {
            res.push(key);
        }
    }

}