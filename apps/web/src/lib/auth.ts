// import type { AuthOptions } from "@nrwlz/auth/types"
// // import { telegramAuthClient } from "@nrwlz/auth/plugins/client"
// import { createAuthClient } from "better-auth/client"
// import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
// import { Injectable } from "@angular/core";
//
//
// const options = {
//   baseURL: "http://localhost:8000",
//   basePath: "/auth",
//   plugins: [
//     inferAdditionalFields<AuthOptions>(),
//     adminClient(),
//     // telegramAuthClient()
//   ]
// }
//
//
// @Injectable({ providedIn: "root" })
// export class AuthProvider {
//   client: ReturnType<typeof createAuthClient<typeof options>>
//   constructor() {
//     this.client = createAuthClient(options)
//   }
// }
