import { Component } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
// import { AuthProvider } from '../lib/auth';


@Component({
  imports: [RouterModule],
  // providers: [AuthProvider],
  selector: 'root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class Root {
  protected title = 'frontend';
}

export const root: Route = {
  path: '',
  component: Root
}
