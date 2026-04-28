import { Component, ViewEncapsulation } from '@angular/core';

import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe } from '@angular/common';
import { NgClass } from '@angular/common';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  standalone: true,
  imports: [
    NgClass,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(
    private breakpointObserver: BreakpointObserver
  ){}

  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 599.98px)')
    .pipe(
      map(result => result.matches),
      shareReplay(),
    );
}
