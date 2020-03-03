"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const axios = axios_1.default.create({
    responseType: 'text',
    baseURL: `/api`,
});
////////////////////////////////////////////////////////////////////////////////////////////////
class API {
    static async get(path, params) {
        const cleanedPath = path.replace(/^\//, '');
        const res = await axios.get(cleanedPath);
        return tryJsonParse(res.data);
    }
    static async post(path, params) {
        const cleanedPath = path.replace(/^\//, '');
        const res = await axios.post(cleanedPath, params || {});
        return tryJsonParse(res.data);
    }
    static async put(path, params) {
        const cleanedPath = path.replace(/^\//, '');
        const res = await axios.put(cleanedPath, params || {});
        return tryJsonParse(res.data);
    }
}
exports.default = API;
API.INVALID_TOKEN = 'InvalidToken';
////////////////////////////////////////////////////////////////////////////////////////////////////
function tryJsonParse(text) {
    try {
        return JSON.parse(text);
    }
    catch (_) {
        return text;
    }
}
//# sourceMappingURL=API.js.map