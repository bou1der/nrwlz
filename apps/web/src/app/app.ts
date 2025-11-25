import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [
    RouterModule,
    CommonModule,
  ],
  standalone: true,
  selector: 'app-root',
  styleUrl: "./app.scss",
  template: `
    <router-outlet/>
  `,
})
export class AppComponent {
  loading = signal(true)
  router = inject(Router)
}

