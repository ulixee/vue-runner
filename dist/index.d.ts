/// <reference types="node" />
import { Express } from 'express';
import { EventEmitter } from 'events';
import IVueOptions from "./src/interfaces/IVueOptions";
export default class VueRunner extends EventEmitter {
    private readonly server;
    constructor(vueTemplatePath: string, vueOptions?: IVueOptions);
    get isReady(): Promise<boolean>;
    attachAPI(fn: (apiServer: Express) => void): void;
}
