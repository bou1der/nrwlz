import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";

@Component({
  imports: [MatButtonModule],
  templateUrl: "./home.html",
  styleUrls: ["./home.scss"],
})
export class HomeComponent {
  router = inject(Router)

  goAdmin() {
    this.router.navigate(["/admin"])
  }
}
