import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-shell-header',
  imports: [RouterLink, MatIconModule, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar>
      <button mat-icon-button [routerLink]="['/']">
          <mat-icon>home</mat-icon>
      </button>
      <button mat-button [routerLink]="['/products']">
        Products
      </button>
    </mat-toolbar>
  `
})
export class HeaderComponent {

}
