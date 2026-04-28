import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-shell-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-shell-header></app-shell-header>
    <div style="padding: 20px">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
}
