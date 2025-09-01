import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { NxWelcome } from './nx-welcome';

// @Component({
//   imports: [NxWelcome, RouterModule],
//   selector: 'app-root',
//   templateUrl: './app.html',
//   styleUrl: './app.scss',
// })
@NgModule({
  imports: [RouterModule],
})
export class App {
  protected title = 'frontend';
}
