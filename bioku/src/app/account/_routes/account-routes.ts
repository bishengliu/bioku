//routing
import { Routes } from '@angular/router';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ProfileComponent } from '../profile/profile.component';
import { GroupComponent } from '../group/group.component';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
//guards
import { AuthGuard } from  '../../_guards/AuthGuard';
import { PIGuard } from  '../../_guards/PIGuard';

//childRoutes
//, canActivate: [AuthGuard]
export const accountRoutes: Routes = [
  {path: '', redirectTo: 'profile', pathMatch: 'full'},
  {path: 'forget_password', component: ProfileComponent },
  {path: 'reset/:uid/:token', component: ResetPasswordComponent },
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard, ]},
  {path: 'password', component: ChangePasswordComponent, canActivate: [AuthGuard, ]},
  {path: 'group/:id', component: GroupComponent, canActivate: [AuthGuard, PIGuard]}
]