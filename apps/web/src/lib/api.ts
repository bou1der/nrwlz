import openapiClient, { Client } from "openapi-fetch"
//// @ts-expect-error проблема с билдом
import type { paths } from "@lrp/api/schema"
import { Injectable } from "@angular/core"

export interface IApiClient extends Client<paths, `${string}/${string}`> {
  fdSerializer<B extends {}>(body: B): FormData
}

@Injectable({
  providedIn: 'root',
})
export class ApiProvider implements IApiClient {
  private readonly client = openapiClient<paths>({
    baseUrl: window.location.origin,
    credentials: "include",
  })

  GET = this.client.GET
  POST = this.client.POST
  PUT = this.client.PUT
  DELETE = this.client.DELETE
  OPTIONS = this.client.OPTIONS
  PATCH = this.client.PATCH
  HEAD = this.client.HEAD
  TRACE = this.client.TRACE
  request = this.client.request
  use = this.client.use
  eject = this.client.eject

  fdSerializer<B extends {}>(body: B) {
    const fd = new FormData();
    for (const name in body) {
      fd.append(name, body[name] as string);
    }
    return fd;
  }
}
