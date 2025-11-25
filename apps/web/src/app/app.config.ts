import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ApiProvider } from '../lib/api';
import { AuthProvider } from '../lib/auth';
import { provideTanStackQuery, QueryClient } from "@tanstack/angular-query-experimental"
import { icons, LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { environment } from '../environments/environment';
import { providePrimeNG } from 'primeng/config';
import { GlobalNGPreset } from "@lrp/styles/ng"


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
  ]
};


