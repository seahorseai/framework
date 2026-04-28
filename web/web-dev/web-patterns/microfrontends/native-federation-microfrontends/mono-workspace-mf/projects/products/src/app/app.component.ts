import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-products-root',
  imports: [MatCardModule],
  template:`
  <mat-card appearance="outlined">
  <mat-card-content>Products App</mat-card-content>
  </mat-card>
`,
})
export class AppComponent {
}
