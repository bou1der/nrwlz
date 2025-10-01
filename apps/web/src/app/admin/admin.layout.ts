import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { LoadingComponent } from "../../components/loading";
import { CommonModule } from "@angular/common";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { AuthProvider } from "../../lib/auth";
import { UserRoleEnum } from "@lrp/shared/types/user";
import { NotFoundPage } from "../not-found/not-found.page";
import { AdminNavbarComponent } from "./navbar/navbar.component";


@Component({
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, CommonModule, NotFoundPage, AdminNavbarComponent],
  styleUrl: "./admin.scss",
  template: `
    <div class="admin-layout_wrapper">
      @if (session.isPending()) {
        <app-loader/>
      } @else if(session.data()?.role !== roles.admin) {
        <app-not-found></app-not-found>
      } @else {
        <router-outlet/>
        <app-admin-navbar />
      }
    </div>
  `
})
export class AdminLayoutComponent {
  roles = UserRoleEnum
  auth = inject(AuthProvider).api
  session = injectQuery(() => ({
    queryKey: ["session"],
    queryFn: async () => (await this.auth.getSession()).data?.user,
  }))
}
