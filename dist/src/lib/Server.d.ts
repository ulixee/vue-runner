/// <reference types="node" />
import Express from 'express';
import { EventEmitter } from 'events';
import IVueOptions from "../interfaces/IVueOptions";
export default class Server {
    port: string;
    readonly uiServer: Express.Express;
    readonly title: string;
    apiServer: Express.Express | null;
    private httpServer;
    private listening;
    private ready;
    private readonly emitter;
    constructor(vueTemplatePath: string, emitter: EventEmitter, vueOptions: IVueOptions);
    get isReady(): Promise<boolean>;
    start(): void;
    startAPI(): import("express-serve-static-core").Express;
    private startUI;
}
