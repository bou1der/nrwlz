import { Component } from '@angular/core';
import { Route, RouterModule } from '@angular/router';


@Component({
  imports: [RouterModule],
  selector: 'root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'frontend';
}

export const rootRoute: Route = {
  path: '',
  component: App
}
