import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
// import { UserRoleEnum } from '@nrwlz/shared';

@Injectable()
export class SignedInGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    // const role: UserRoleEnum = route.data["role"]
    return false;
  }
}

// @Injectable()
// export class SignedInGuard implements CanActivate {
//   async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<GuardResult | Observable<GuardResult>> {
//     // const role: UserRoleEnum = route.data["role"]
//     return false;
//   }
// }
