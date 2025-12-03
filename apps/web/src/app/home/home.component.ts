import { Component, inject } from "@angular/core"
import { PRIME_NG_CONFIG } from "primeng/config";
import { TranslocoHttpLoader } from "../transloco-loader";
import { CommonModule } from "@angular/common";
import { TranslocoDirective, TranslocoService } from "@jsverse/transloco";
import { LanguageSwitcherComponent } from "@lrp/web/components/language-switcher";


@Component({
  imports: [
    CommonModule,
    TranslocoDirective,
    LanguageSwitcherComponent,
  ],
  template: `
    <app-language-switcher></app-language-switcher>
    <h1 *transloco="let t">{{ t('hello') }}</h1>
  `,
  styleUrl: "./home.scss",
})
export class HomeComponent {
  primeNgConfig = inject(PRIME_NG_CONFIG);
  locale = inject(TranslocoHttpLoader)
  i18n = inject(TranslocoService)

  toggleTheme() {
    console.log(this.primeNgConfig.theme)
  }

  changeLocale(locale: string) {
    this.i18n.setActiveLang(locale)
  }
}
