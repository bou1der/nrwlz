import { Route } from '@angular/router';
import { rootRoute } from './app';
import { notFoundRoute } from './not-found/not-found.page';

export const appRoutes: Route[] = [
  rootRoute,
  notFoundRoute
]
