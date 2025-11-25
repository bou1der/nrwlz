import { Route } from "@angular/router";
import { ErrorComponent } from "./error/error.components";
import { NotFoundPage } from "./not-found/not-found.page";
import { HomeComponent } from "./home/home.component";

export const routes: Route[] = [
  {
    path: "",
    component: HomeComponent,
    pathMatch: "full"
  },
  {
    path: "error",
    component: ErrorComponent,
  },
  {
    path: "**",
    component: NotFoundPage,
  }
]
