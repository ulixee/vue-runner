import * as Http from 'http';
import * as Path from 'path';
import * as Fs from 'fs';
import Express from 'express';
import Logger from 'morgan';
import BodyParser from 'body-parser';
import ExpressHandlebars from 'express-handlebars';
import Webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import CreateResolvablePromise from '../lib/CreateResolvablePromise';
import { EventEmitter } from 'events';
import IVueOptions from "../interfaces/IVueOptions";

const CliService = require('@vue/cli-service/lib/Service');

const DEFAULT_PORT = '3000';
const BASE_DIR = Path.resolve(__dirname, '../../');

export default class Server {
  public port: string;
  public readonly uiServer: Express.Express;
  public readonly title: string;
  public apiServer: Express.Express | null = null;
  private httpServer: Http.Server;
  private listening = CreateResolvablePromise<boolean>();
  private ready = CreateResolvablePromise<boolean>();
  private readonly emitter: EventEmitter;

  constructor(vueTemplatePath: string, emitter: EventEmitter, vueOptions: IVueOptions) {
    this.emitter = emitter;
    this.port = vueOptions.port || process.env.PORT || DEFAULT_PORT;
    this.title = vueOptions.title || Path.basename(vueTemplatePath).replace('.vue', '');
    this.uiServer = this.startUI(vueTemplatePath);
    this.httpServer = new Http.Server(this.uiServer);
  }

  public get isReady(): Promise<boolean> {
    return this.ready.promise;
  }

  public start() {
    this.uiServer.set('port', this.port || DEFAULT_PORT);

    this.httpServer.on('error', (error: any) => {
      this.emitter.emit('error', error);
      if (error.syscall !== 'listen') throw error;

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
      const addr: any = this.httpServer.address();
      console.log(
          ''.padEnd(100, '-') +
          `\nListening on port ${addr.port}\n` +
          ''.padEnd(100, '-')
      );
      this.listening.resolve();
      this.emitter.emit('listening');
    });

    this.httpServer.listen(this.port);
  }

  public startAPI() {
    const apiServer = Express();
    this.uiServer.use('/api', apiServer);
    this.apiServer = apiServer;
    return apiServer;
  }

  private startUI(vueTemplatePath: string) {
    const uiServer = Express();

    uiServer.use(Logger('dev'));

    uiServer.use(BodyParser.json());
    uiServer.use(BodyParser.urlencoded({ extended: true }));

    uiServer.engine('handlebars', ExpressHandlebars());
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

    const compiler = Webpack(webpackConfig);
    const devMiddleware = WebpackDevMiddleware(compiler, { publicPath: webpackConfig.output.publicPath });
    const hotMiddleware = WebpackHotMiddleware(compiler);
    uiServer.use(devMiddleware);
    uiServer.use(hotMiddleware);

    devMiddleware.waitUntilValid(async () => {
      await this.listening.promise;
      this.ready.resolve();
      this.emitter.emit('ready');
      console.log(
          ''.padEnd(100, '-') +
          `\nWebsite ready: http://localhost:${this.port}\n` +
          ''.padEnd(100, '-')
      );
    });

    return uiServer;
  }
}
