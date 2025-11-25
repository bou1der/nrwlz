import { Component, inject } from "@angular/core"
import { Button } from "primeng/button";
import { PRIME_NG_CONFIG } from "primeng/config";

@Component({
  imports: [
    Button,
  ],
  template: `
    <p-button (click)="toggleTheme()" label="Home" ></p-button>
  `,
  styleUrl: "./home.scss",
})
export class HomeComponent {
  primeNgConfig = inject(PRIME_NG_CONFIG);

  toggleTheme() {
    console.log(this.primeNgConfig.theme)
  }

}
