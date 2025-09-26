import openapiClient from "openapi-fetch"
import type { paths } from "@lrp/api/schema"

export class ApiProvider {
  // private readonly http = inject(HttpClient)
  client: ReturnType<typeof openapiClient<paths>>

  constructor() {
    this.client = openapiClient({
      baseUrl: "http://localhost:8000",
      // process.env["API_URL"],
      credentials: "include",
    })
  }

  fdSerializer<B extends {}>(body: B) {
    const fd = new FormData();
    for (const name in body) {
      fd.append(name, body[name] as string);
    }
    return fd;
  }

  // createObservable<P extends keyof paths, M extends Methods<P>>(path:P, method:M) {
  //   // this.http.request(new Request({
  //   //   method,
  //   //   url:path
  //   // }))
  //   // this.http[method](path)
  // }

  // async request<M extends Method, P extends Parameters<typeof this.client.request<M>>[1]>(method:M, path:P, ){
  //   type a = Parameters<typeof this.client.request<M, "">>[1]
  //
  //   this.client.request("post", "/file")
  //
  // }
}



