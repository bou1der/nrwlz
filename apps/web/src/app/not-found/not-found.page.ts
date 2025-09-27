import { Component } from "@angular/core";
import { Route } from "@angular/router";
// import { SignedInGuard } from "../../lib/guards/signedIn.guard";


@Component({
  selector: "app-not-found",
  // providers: [SignedInGuard],
  styleUrls: ["./not-found.scss"],
  template: `
    <div class="not-found_container">
      <h1 class="not-found_code">404</h1>
      <h2>Page not found</h2>
    </div>
  `
})
export class NotFoundPage { }

export const notFoundRoute: Route = {
  path: "**",
  component: NotFoundPage,
}
