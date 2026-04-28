import { Component } from '@angular/core';


import { CounterComponent } from './counter.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CounterComponent],
   template: `
    <div style="text-align:center; margin-top:100px;">
      <h1>Angular Counter</h1>
      <app-counter></app-counter>
    </div>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'counter-standalone-poc';
}






