//root routes
//all sub routes must bw registered here before use

import { HomeComponent } from '../home/home.component';
import { AdminComponent } from '../admin/admin.component';
import { AccountComponent } from '../account/account.component';
import { RegisterComponent } from '../account/register/register.component';
import { PageNotFoundComponent } from '.././_helpers/page-not-found/page-not-found.component';
import { PermissionDeniedComponent } from '.././_helpers/permission-denied/permission-denied.component';
import { LoginComponent } from '../account/login/login.component';
import { MyContainerListComponent } from '../containers/my-container-list/my-container-list.component';
import { ContainerBoxListComponent } from '../containers/container-box-list/container-box-list.component';
import { BoxDetailComponent } from '../containers/box-detail/box-detail.component';
//guards
import { AuthGuard } from  '../_guards/AuthGuard';
import { AdminGuard } from  '../_guards/AdminGuard';
//routing
import { Routes } from '@angular/router';
import { accountRoutes } from '../account/_routes/account-routes';
import { adminRoutes } from '../admin/_routes/admin-routes';
import { containersRoutes } from '../containers/_routes/containers-routes';
//app root routes
export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user', component: AccountComponent, children: accountRoutes},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard, ], children: adminRoutes},
  {path: 'containers', component: MyContainerListComponent, canActivate: [AuthGuard, ] },
  {path: 'containers/:id', component: ContainerBoxListComponent, canActivate: [AuthGuard, ] },
  {path: 'containers/:ct_pk/:box_pos', component: BoxDetailComponent, canActivate: [AuthGuard, ] },
  {path: 'denied', component: PermissionDeniedComponent},
  {path: '**', component: PageNotFoundComponent}
]