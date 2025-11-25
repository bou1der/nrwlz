import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";


@Component({
  imports: [MatButtonModule],
  selector: "app-not-found",
  styleUrls: ["./not-found.scss"],
  template: `
    <div class="not-found_container">
      <h1 class="not-found_code">404</h1>
      <h2 class="not-found_message">Страница не найдена</h2>
      <button mat-flat-button (click)="goBack()">На главную</button>
    </div>
  `
})
export class NotFoundPage {
  router = inject(Router)
  goBack() {
    this.router.navigate(["/"])
  }
}

