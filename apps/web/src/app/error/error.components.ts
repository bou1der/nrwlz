import { Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";


@Component({
  templateUrl: "./error.html",
  styleUrls: ["./error.scss"]
})
export class ErrorComponent {
  title = 'Ошибка';
  private readonly route = inject(ActivatedRoute);
  constructor() {
    this.route.queryParams.subscribe(params => {
      if (Boolean(params["telegram"]) === true) {
        this.title = 'Войдите с помощью Telegram чтобы получить доступ к приложению';
      } else if (Boolean(params["forbidden"]) === true) {
        this.title = 'Доступ запрещен';
      }
    })
  }

}
