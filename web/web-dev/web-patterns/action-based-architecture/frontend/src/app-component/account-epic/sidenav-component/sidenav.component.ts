import { Component, EventEmitter, Output, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { PrintBoundedContextsComponent } from './subdomain-list-component/subdomain-list.component';
import { AppbarComponent } from '../../project-epic/home-component/appbar-component/appbar.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
		AppbarComponent,
		PrintBoundedContextsComponent
  ]
})
export class SidenavComponent {
  private breakpointObserver = inject(BreakpointObserver);
	@Output() onHandsetDrawerClick = new EventEmitter<any>();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 599.98px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
