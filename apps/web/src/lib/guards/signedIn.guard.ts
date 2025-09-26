// import { inject, Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, GuardResult } from '@angular/router';
// import { AuthProvider } from '../auth';
//
// @Injectable({ providedIn: "platform" })
// export class SignedInGuard implements CanActivate {
//   auth: AuthProvider['client'] = inject(AuthProvider).client
//   async canActivate(_: ActivatedRouteSnapshot): Promise<GuardResult> {
//     const session = await this.auth.getSession()
//     if (!!session.data !== _.data["isSignedIn"]) return false;
//     return true;
//   }
// }
