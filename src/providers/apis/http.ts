import axios from 'axios';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
export class Http {
  private static INSTANCE = new Http();

  static get instance() {
    return this.INSTANCE;
  }

  public get(url: string, headers?: any, params?: any) {
    const options = {
      url: this.formURL(url),
      method: 'get',
      headers,
      params,
    };
    return axios(options);
  }

  public post(url: string, headers?: any, data?: any) {
    const options = {
      url: this.formURL(url),
      method: 'post',
      headers,
      data: data ? JSON.stringify(data) : '{}',
    };
    return axios(options);
  }

  public put(url: string, headers?: any, data?: any) {
    const options = {
      url: this.formURL(url),
      method: 'put',
      headers,
      data,
    };
    return axios(options);
  }

  public delete(url: string, headers?: any, data?: any) {
    const options = {
      url: this.formURL(url),
      method: 'delete',
      headers,
      data,
    };
    return axios(options);
  }

  public getBasicHeaders(token: string) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${window.btoa(token)}`,
    };
  }

  private formURL(url: string) {
    const apiUrl = process.env.VUE_APP_API_URL;
    if (apiUrl && !url.includes('http')) {
      url = `${apiUrl}/${url}`;
    }
    return url;
  }
}

export const http = Http.instance;
