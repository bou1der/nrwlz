import openapiClient from "openapi-fetch"
import type { paths } from "@nrwlz/api-fetch/schema"


/**
* @returns
* openApiClient with typings
*/
const createClient = openapiClient<paths>


/** 
* @param body 
* Object
* @returns
* Serialized FormData
*/
function fd<B extends {}>(body: B): FormData {
  const fd = new FormData();
  for (const name in body) {
    fd.append(name, body[name] as string);
  }
  return fd;
}


export {
  createClient,
  fd
}
