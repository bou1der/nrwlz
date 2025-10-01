import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { EventType, Router } from "@angular/router";
import { LucideAngularModule } from "lucide-angular";

@Component({
  standalone: true,
  selector: "app-admin-navbar",
  imports: [
    LucideAngularModule,
    MatButtonModule
  ],
  template: `
    <nav class="admin-navbar_wrapper">
      @for(route of routes; track route.path){
        <button mat-button class="admin-navbar_item" (click)="onNavigate(route)" [class.active]="active === route.path">
          <i-lucide class="icon"  [name]="route.icon" [strokeWidth]="2" />
        </button>
      }
    </nav>
  `,
  styleUrls: ["./navbar.scss"],
})
export class AdminNavbarComponent {
  router = inject(Router)
  active: string
  routes = [
    {
      icon: "door-open",
      path: "/",
    },
    {
      icon: "house",
      path: "/admin",
    },
    {
      icon: "user",
      path: "/admin/users",
    }
  ];

  constructor() {
    console.log(this.router.url)
    this.active = this.router.url
    this.router.events.subscribe((e) => {
      if (e.type === EventType.NavigationEnd) {
        this.active = e.url
      }
    })
  }

  onNavigate(route: typeof this.routes[number]) {
    this.router.navigate([route.path])
  }
}
