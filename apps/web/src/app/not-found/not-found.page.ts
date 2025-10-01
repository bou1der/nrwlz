import { Location } from "@angular/common";
import { Component, inject } from "@angular/core";


@Component({
  selector: "app-not-found",
  styleUrls: ["./not-found.scss"],
  template: `
    <div class="not-found_container">
      <h1 class="not-found_code">404</h1>
      <h2>Page not found</h2>
      <button mat-raised-button (click)="goBack()">Назад</button>
    </div>
  `
})
export class NotFoundPage {
  location = inject(Location)

  goBack() {
    this.location.back()
  }
}

