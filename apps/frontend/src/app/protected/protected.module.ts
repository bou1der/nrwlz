import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { PageModule, symb } from '~/lib/common/module';

// const routes: Route[] = [
//
// ];

export const protectedRoute: Route = {
}

@NgModule({

})
export class ProtectedModule implements PageModule {
  [symb]: Route = {
  }
}
