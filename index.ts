import * as Path from 'path';
import Server from './src/lib/Server';
import { Express } from 'express';
import { EventEmitter } from 'events';
import IVueOptions from "./src/interfaces/IVueOptions";

export default class VueRunner extends EventEmitter {
  private readonly server: Server;

  constructor(vueTemplatePath: string, vueOptions: IVueOptions = {}) {
    super();
    const absoluteVueTemplatePath = createAbsolutePath(vueTemplatePath);
    this.server = new Server(absoluteVueTemplatePath, this, vueOptions);
    this.server.start();
  }

  get isReady() {
    return this.server.isReady;
  }

  public attachAPI(fn: (apiServer: Express) => void) {
    const apiServer = this.server.startAPI();
    fn(apiServer);
  }
}

function createAbsolutePath(path: string) {
  const isAbsolute = Path.resolve(path) === Path.normalize(path).replace( RegExp(Path.sep+'$'), '' );
  if (isAbsolute) return path;
  return Path.resolve(process.cwd(), path);
}
