import type {Config} from "./types";

export type RequestData = {
  auth?: boolean;
  body?: RequestInit["body"];
  headers?: Record<string, string>;
  method: string;
  path: string;
  signal?: AbortSignal;
};

export default class RESTClient {
  private config: Readonly<Config>;
  private auth: Readonly<string>;

  constructor(config: Config) {
    this.config = config;
    this.auth = Buffer.from(`${config.key}:${config.secret}`).toString("base64");
  }

  protected async delete(req: Omit<RequestData, "method">): Promise<Response> {
    return this.request({method: "DELETE", ...req});
  }

  protected async get(req: Omit<RequestData, "method">): Promise<Response> {
    return this.request({method: "GET", ...req});
  }

  protected async post(req: Omit<RequestData, "method">): Promise<Response> {
    return this.request({method: "POST", ...req});
  }

  protected async put(req: Omit<RequestData, "method">): Promise<Response> {
    return this.request({method: "PUT", ...req});
  }

  protected async request(req: RequestData): Promise<Response> {
    const url = this.config.test
      ? "https://api.staging.budbee.com"
      : "https://api.budbee.com";
    const headers = new Headers({
      Authorization: `Basic ${this.auth}`,
      ...req.headers,
    });

    return fetch(`${url}/${req.path}`, {
      body: req.body,
      headers,
      method: req.method,
      signal: req.signal,
    })
      .then(res => {
        if (res.status < 200 || res.status > 399) {
          throw res;
        }
        return res;
      });
  }
}
