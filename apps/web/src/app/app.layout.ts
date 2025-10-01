import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { init, retrieveRawInitData, miniApp, settingsButton, viewport, LaunchParamsRetrieveError } from "@telegram-apps/sdk";
import { LoadingComponent } from '../components/loading';
import { CommonModule } from '@angular/common';
import { ApiProvider } from '../lib/api';
import { AuthProvider } from '../lib/auth';
import { UserRoleEnum } from '@lrp/shared/types/user';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, CommonModule,
    LucideAngularModule
  ],
  template: `
    <ng-container *ngIf="!loading; else load">
      <router-outlet></router-outlet>
    </ng-container>
    <ng-template #load>
      <app-loader></app-loader>
    </ng-template>
  `,
})
export class AppLayoutComponent implements OnInit {
  loading = true;
  router = inject(Router)
  api = inject(ApiProvider)
  auth = inject(AuthProvider)

  async ngOnInit() {
    try {
      init();
      miniApp.mountSync();
      settingsButton.mount();
      viewport.mount();
      viewport.expand();
      const initDataRaw = retrieveRawInitData();
      if (!initDataRaw) throw new LaunchParamsRetrieveError([["InitDataRaw is undefined", 12]]);
      let session = await this.auth.api.getSession()
      if (!session.data) {
        await this.auth.api.telegram.signIn({
          initDataRaw,
        })
        session = await this.auth.api.getSession()
      }
      if (![UserRoleEnum.user, UserRoleEnum.admin].includes(session.data?.user.role as UserRoleEnum)) {
        this.router.navigate(['/error'], {
          queryParams: {
            forbidden: true
          }
        });
      }
      this.loading = false
    } catch (e) {
      let telegram = false;
      if (e instanceof LaunchParamsRetrieveError) telegram = true;
      this.router.navigate(['/error'], {
        queryParams: {
          telegram: telegram || undefined
        }
      });
      this.loading = false;
    }
  }
}
