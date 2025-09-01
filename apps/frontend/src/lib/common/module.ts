import { Route } from '@angular/router';

export const symb = Symbol('route')
export interface PageModule {
  [symb]: Route
}
