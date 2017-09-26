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
import { AddContainerComponent } from '../admin/containers/add-container/add-container.component';
import { EditContainerComponent } from '../admin/containers/edit-container/edit-container.component';
import { DeleteContainerComponent } from '../admin/containers/delete-container/delete-container.component';
import { ContainerOverviewComponent } from '../containers/container-overview/container-overview.component';
import { ContainerBoxListComponent } from '../containers/container-box-list/container-box-list.component';
import { BoxDetailComponent } from '../containers/box-detail/box-detail.component';
import { ContainerBoxAddComponent } from '../containers/container-box-add/container-box-add.component';
import { ContainerBoxMoveComponent } from '../containers/container-box-move/container-box-move.component';
import { MoveSampleComponent } from '../containers/move-sample/move-sample.component';
import { SampleSearchComponent } from '../containers/sample-search/sample-search.component';
import { StoreSampleComponent } from '../containers/store-sample/store-sample.component';
//guards
import { AuthGuard } from  '../_guards/AuthGuard';
import { AdminGuard } from  '../_guards/AdminGuard';
//routing
import { Routes } from '@angular/router';
import { accountRoutes } from '../account/_routes/account-routes';
import { adminRoutes } from '../admin/_routes/admin-routes';
//import { containersRoutes } from '../containers/_routes/containers-routes';
//app root routes
export const routes: Routes = [
  {path: '', component: HomeComponent},
  //{path: '', redirectTo: 'login', pathMatch: 'full'}, 
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user', component: AccountComponent, children: accountRoutes},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard, ], children: adminRoutes}, 
  {path: 'containers/add', component: AddContainerComponent, canActivate: [AuthGuard, ] },
  {path: 'containers/search', component: SampleSearchComponent, canActivate: [AuthGuard, ], pathMatch: 'full' },
  {path: 'containers/overview/:id', component: ContainerOverviewComponent, canActivate: [AuthGuard, ] },
  {path: 'containers/overview/addbox/:id', component: ContainerBoxAddComponent, canActivate: [AuthGuard, ] },
  {path: 'containers/overview/movebox/:id', component: ContainerBoxMoveComponent, canActivate: [AuthGuard, ] },
  {path: 'containers/edit/:id', component: EditContainerComponent, canActivate: [AuthGuard, ] },
  {path: 'containers/delete/:id', component: DeleteContainerComponent, canActivate: [AuthGuard, ] },
  {path: 'containers/:id', component: ContainerBoxListComponent, canActivate: [AuthGuard, ] },
  {path: 'containers/:ct_pk/:box_pos', component: BoxDetailComponent, canActivate: [AuthGuard, ] },
  {path: 'containers/:ct_pk/:box_pos/move_samples', component: MoveSampleComponent, canActivate: [AuthGuard, ] },
  {path: 'containers/:ct_pk/:box_pos/store_samples', component: StoreSampleComponent, canActivate: [AuthGuard, ] },
  {path: 'containers', component: MyContainerListComponent, canActivate: [AuthGuard, ] },
  {path: 'denied', component: PermissionDeniedComponent},
  {path: '**', component: PageNotFoundComponent}
]