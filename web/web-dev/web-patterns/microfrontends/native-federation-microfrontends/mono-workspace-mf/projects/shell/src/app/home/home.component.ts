import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-shell-home',
  imports: [MatCardModule],
  template: `
  <mat-card appearance="outlined">
  <mat-card-content>Home</mat-card-content>
  </mat-card>`,
})
export class HomeComponent {

}
