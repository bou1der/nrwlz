import { Route } from "@angular/router";
import { AppLayoutComponent } from "./app.layout";
import { AuthPage } from "./auth/auth.page";
import { ErrorComponent } from "./error/error.components";
import { HomeComponent } from "./home/home.component";
import { NotFoundPage } from "./not-found/not-found.page";
import { AdminLayoutComponent } from "./admin/admin.layout";
import { AdminDashbordComponent } from "./admin/dashbord/dashbord.component";
import { AdminUsersComponent } from "./admin/users/users.component";

export const routes: Route[] = [
  {
    path: "error",
    component: ErrorComponent,
  },
  {
    path: "",
    component: AppLayoutComponent,
    children: [
      {
        path: "",
        component: HomeComponent
      },
      {
        path: "admin",
        component: AdminLayoutComponent,
        children: [
          {
            path: "",
            component: AdminDashbordComponent
          },
          {
            path: "users",
            component: AdminUsersComponent
          }
        ],
      },
      {
        path: "auth",
        component: AuthPage
      },
      {
        path: "**",
        component: NotFoundPage,
      }
    ]
  },
]
