import { Routes } from '@angular/router';

import { HomeComponent } from './project-epic/home-component/home.component';
import { SignInComponent } from './account-epic/signin-component/sign-in.component';
import { LogInComponent } from './account-epic/login-component/log-in.component';

export const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "signin", component: SignInComponent },
  { path: "login", component: LogInComponent },
  { path: "", redirectTo: "signin", pathMatch: "full" }
];
