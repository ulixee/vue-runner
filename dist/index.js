"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Path = tslib_1.__importStar(require("path"));
const Server_1 = tslib_1.__importDefault(require("./src/lib/Server"));
const events_1 = require("events");
class VueRunner extends events_1.EventEmitter {
    constructor(vueTemplatePath, vueOptions = {}) {
        super();
        const absoluteVueTemplatePath = createAbsolutePath(vueTemplatePath);
        this.server = new Server_1.default(absoluteVueTemplatePath, this, vueOptions);
        this.server.start();
    }
    get isReady() {
        return this.server.isReady;
    }
    attachAPI(fn) {
        const apiServer = this.server.startAPI();
        fn(apiServer);
    }
}
exports.default = VueRunner;
function createAbsolutePath(path) {
    const isAbsolute = Path.resolve(path) === Path.normalize(path).replace(RegExp(Path.sep + '$'), '');
    if (isAbsolute)
        return path;
    return Path.resolve(process.cwd(), path);
}
//# sourceMappingURL=index.js.map