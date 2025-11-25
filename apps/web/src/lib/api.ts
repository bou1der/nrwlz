import openapiClient, { Client } from "openapi-fetch"
import type { paths, components } from "@lrp/api/schema"
import { Injectable } from "@angular/core"
import { ExtractSchemas } from "@lrp/shared/utils/entities"
// import { MatSnackBar } from "@angular/material/snack-bar"

export interface IApiClient extends Client<paths, `${string}/${string}`> {
  fdSerializer<B extends {}>(body: B): FormData
}
export type Schemas = ExtractSchemas<components>

@Injectable({
  providedIn: 'root',
})
export class ApiProvider implements IApiClient {

  private readonly client = openapiClient<paths>({
    baseUrl: `${window.location.origin}/api`,
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

  handleError(error: Schemas["HttpError"]) {
    // this.snake.open(Array.isArray(error.message) ? error.message[0] : error.message, "ок", {
    //   duration: 4000,
    //   politeness: "polite",
    //   panelClass: ["error"]
    // })
  }
}


