import Axios from 'axios';

const axios = Axios.create({
  responseType: 'text',
  baseURL: `/api`,
});

////////////////////////////////////////////////////////////////////////////////////////////////

export default class API {
  public static INVALID_TOKEN = 'InvalidToken';

  public static async get(path: string, params?: { [key: string]: any }) {
    const cleanedPath = path.replace(/^\//, '');
    const res = await axios.get(cleanedPath);
    return tryJsonParse(res.data);
  }

  public static async post(path: string, params?: { [key: string]: any }) {
    const cleanedPath = path.replace(/^\//, '');
    const res = await axios.post(cleanedPath, params || {});
    return tryJsonParse(res.data);
  }

  public static async put(path: string, params?: { [key: string]: any }) {
    const cleanedPath = path.replace(/^\//, '');
    const res = await axios.put(cleanedPath, params || {});
    return tryJsonParse(res.data);
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function tryJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return text;
  }
}
