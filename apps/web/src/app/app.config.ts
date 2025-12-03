import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ApiProvider } from '../lib/api';
import { AuthProvider } from '../lib/auth';
import { provideTanStackQuery, QueryClient } from "@tanstack/angular-query-experimental"
import { icons, LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { environment } from '../environments/environment';
import { providePrimeNG } from 'primeng/config';
import { GlobalNGPreset } from "@lrp/styles/ng";
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco'
import { cookiesStorage, provideTranslocoPersistLang } from "@jsverse/transloco-persist-lang"
import { I18nCode } from "@lrp/shared/types/i18n";


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideTanStackQuery(new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: environment.production ? 15_000 : 0,
        }
      }
    })),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: GlobalNGPreset,
        options: {
          darkModeSelector: '.dark',
        }
      },
    }),
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider(icons)
    },
    ApiProvider,
    AuthProvider,
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: Object.keys(I18nCode),
        defaultLang: I18nCode.en,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader
    }),
    provideTranslocoPersistLang({
      storage: {
        useValue: cookiesStorage()
      },
      storageKey: "lang"
    })
  ]
};


