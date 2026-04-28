import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () =>
        loadRemoteModule('products', './Component').then((m) => m.AppComponent),
  },
  {
      path: '**',
      component: HomeComponent,
  }
];
