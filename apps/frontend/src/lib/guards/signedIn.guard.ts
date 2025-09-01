import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, RouterStateSnapshot } from '@angular/router';
import { AuthProvider } from '../auth';

@Injectable()
export class SignedInGuard implements CanActivate {
  auth = inject(AuthProvider)
  async canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<GuardResult> {
    console.log(state)
    // state.root.data.isSignedIn
    // const session = await this.auth.getSession()
    // console.log(session)
    return true;
  }
}

// @Injectable()
// export class SignedInGuard implements CanActivate {
//   async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<GuardResult | Observable<GuardResult>> {
//     // const role: UserRoleEnum = route.data["role"]
//     return false;
//   }
// }
