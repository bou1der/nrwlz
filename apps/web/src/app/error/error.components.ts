import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router } from "@angular/router";


@Component({
  imports: [MatButtonModule],
  templateUrl: "./error.html",
  styleUrls: ["./error.scss"]
})
export class ErrorComponent {
  title = 'Ошибка';
  router = inject(Router)
  private readonly route = inject(ActivatedRoute);
  constructor() {
    this.route.queryParams.subscribe(params => {
      if (Boolean(params["forbidden"]) === true) {
        this.title = 'Доступ запрещен';
        return
      }
    })
  }

  home() {
    this.router.navigate(["/"])
  }

}
