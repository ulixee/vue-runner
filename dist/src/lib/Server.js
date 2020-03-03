"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Http = tslib_1.__importStar(require("http"));
const Path = tslib_1.__importStar(require("path"));
const Fs = tslib_1.__importStar(require("fs"));
const express_1 = tslib_1.__importDefault(require("express"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const express_handlebars_1 = tslib_1.__importDefault(require("express-handlebars"));
const webpack_1 = tslib_1.__importDefault(require("webpack"));
const webpack_dev_middleware_1 = tslib_1.__importDefault(require("webpack-dev-middleware"));
const webpack_hot_middleware_1 = tslib_1.__importDefault(require("webpack-hot-middleware"));
const CreateResolvablePromise_1 = tslib_1.__importDefault(require("../lib/CreateResolvablePromise"));
const CliService = require('@vue/cli-service/lib/Service');
const DEFAULT_PORT = '3000';
const BASE_DIR = Path.resolve(__dirname, '../../');
class Server {
    constructor(vueTemplatePath, emitter, vueOptions) {
        this.apiServer = null;
        this.listening = CreateResolvablePromise_1.default();
        this.ready = CreateResolvablePromise_1.default();
        this.emitter = emitter;
        this.port = vueOptions.port || process.env.PORT || DEFAULT_PORT;
        this.title = vueOptions.title || Path.basename(vueTemplatePath).replace('.vue', '');
        this.uiServer = this.startUI(vueTemplatePath);
        this.httpServer = new Http.Server(this.uiServer);
    }
    get isReady() {
        return this.ready.promise;
    }
    start() {
        this.uiServer.set('port', this.port || DEFAULT_PORT);
        this.httpServer.on('error', (error) => {
            this.emitter.emit('error', error);
            if (error.syscall !== 'listen')
                throw error;
            switch (error.code) {
                case 'EACCES':
                    console.error(`${this.port} requires elevated privileges`);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(`${this.port} is already in use`);
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });
        this.httpServer.on('listening', () => {
            const addr = this.httpServer.address();
            console.log(''.padEnd(100, '-') +
                `\nListening on port ${addr.port}\n` +
                ''.padEnd(100, '-'));
            this.listening.resolve();
            this.emitter.emit('listening');
        });
        this.httpServer.listen(this.port);
    }
    startAPI() {
        const apiServer = express_1.default();
        this.uiServer.use('/api', apiServer);
        this.apiServer = apiServer;
        return apiServer;
    }
    startUI(vueTemplatePath) {
        const uiServer = express_1.default();
        uiServer.use(morgan_1.default('dev'));
        uiServer.use(body_parser_1.default.json());
        uiServer.use(body_parser_1.default.urlencoded({ extended: true }));
        uiServer.engine('handlebars', express_handlebars_1.default());
        uiServer.set('view engine', 'handlebars');
        const cliService = new CliService(BASE_DIR);
        cliService.init('development');
        cliService.pkg.name = this.title;
        const webpackConfig = cliService.resolveWebpackConfig();
        const jsAppEntryPath = webpackConfig.entry.app[0].replace('.ts', '.js');
        const absoluteJsAppEntryPath = Path.resolve(BASE_DIR, jsAppEntryPath);
        if (Fs.existsSync(absoluteJsAppEntryPath)) {
            webpackConfig.entry.app[0] = jsAppEntryPath;
        }
        webpackConfig.resolve.alias.dynamicAppTemplate = vueTemplatePath;
        console.log(''.padEnd(150, '-'));
        console.log(JSON.stringify(webpackConfig, null, 2));
        // console.log(cliService);
        console.log(''.padEnd(150, '-'));
        const compiler = webpack_1.default(webpackConfig);
        const devMiddleware = webpack_dev_middleware_1.default(compiler, { publicPath: webpackConfig.output.publicPath });
        const hotMiddleware = webpack_hot_middleware_1.default(compiler);
        uiServer.use(devMiddleware);
        uiServer.use(hotMiddleware);
        devMiddleware.waitUntilValid(async () => {
            await this.listening.promise;
            this.ready.resolve();
            this.emitter.emit('ready');
            console.log(''.padEnd(100, '-') +
                `\nWebsite ready: http://localhost:${this.port}\n` +
                ''.padEnd(100, '-'));
        });
        return uiServer;
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map