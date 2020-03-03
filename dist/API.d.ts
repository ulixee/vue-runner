export default class API {
    static INVALID_TOKEN: string;
    static get(path: string, params?: {
        [key: string]: any;
    }): Promise<any>;
    static post(path: string, params?: {
        [key: string]: any;
    }): Promise<any>;
    static put(path: string, params?: {
        [key: string]: any;
    }): Promise<any>;
}
