import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TranslocoService, LangDefinition } from "@jsverse/transloco";
import { SelectModule, SelectChangeEvent } from "primeng/select";
import { FormsModule } from "@angular/forms";

@Component({
  imports: [
    CommonModule,
    SelectModule,
    FormsModule
  ],
  selector: 'app-language-switcher',
  templateUrl: "./index.html",
  styleUrls: ["./index.scss"],
})
export class LanguageSwitcherComponent {
  currentLang: string;
  langs: string[]
  i18n = inject(TranslocoService)

  constructor() {
    this.currentLang = this.i18n.getActiveLang()
    const availableLangs = this.i18n.getAvailableLangs()

    if (typeof availableLangs[0] === 'string') {
      this.langs = availableLangs as string[]
    } else {
      this.langs = availableLangs.map((l) => (l as LangDefinition).id)
    }

  }

  changeLang(event: SelectChangeEvent) {
    this.i18n.setActiveLang(event.value)
  }
}
