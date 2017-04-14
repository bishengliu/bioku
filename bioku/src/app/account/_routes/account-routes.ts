//routing
import { Routes } from '@angular/router';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ProfileComponent } from '../profile/profile.component';

//childRoutes
export const accountRoutes: Routes = [
  {path: '', redirectTo: 'profile', pathMatch: 'full'},
  {path: 'profile', component: ProfileComponent},
  {path: 'password', component: ChangePasswordComponent}
]