// root routes
// all sub routes must bw registered here before use
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
import { ForgetPasswordComponent } from '../account/forget-password/forget-password.component';
import { ResetPasswordComponent } from '../account/reset-password/reset-password.component';
import { ContainerSampleUploadComponent } from '../containers/container-sample-upload/container-sample-upload.component';
import { BoxManageComponent } from '../containers/box-manage/box-manage.component';
import { CtypeComponent } from '../ctype/ctype.component';
import { CsampleManageComponent } from '../containers/csample-manage/csample-manage.component';
// guards
import { AuthGuard } from '../_guards/AuthGuard';
import { AdminGuard } from '../_guards/AdminGuard';
import { PIGuard } from '../_guards/PIGuard';
import { AssistantGuard } from '../_guards/AssistantGuard';
import { FetchAuthInfoGuard } from '../_guards/FetchAuthInfoGuard';
import { CleanLocalStorageGuard } from '../_guards/CleanLocalStorageGuard';
import { ContainerSampleUploadGuard } from '../_guards/ContainerSampleUploadGuard';
import { GroupCountGuard } from '../_guards/GroupCountGuard';
import { AppActiveGuard } from '../_guards/AppActiveGuard';
// routing
import { Routes } from '@angular/router';
import { accountRoutes } from '../account/_routes/account-routes';
import { adminRoutes } from '../admin/_routes/admin-routes';
import { ctypeRoutes } from '../ctype/_routes/ctype_routes';
// import { containersRoutes } from '../containers/_routes/containers-routes';
// app root routes
export const routes: Routes = [
  // {path: '', component: HomeComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent,
                        canActivate: [AppActiveGuard, CleanLocalStorageGuard, ]},
  {path: 'register', component: RegisterComponent,
                        canActivate: [CleanLocalStorageGuard, ]},
  {path: 'forget_password', component: ForgetPasswordComponent,
                        canActivate: [CleanLocalStorageGuard, ]},
  {path: 'reset_password/:uid/:token', component: ResetPasswordComponent,
                        canActivate: [CleanLocalStorageGuard, ]},
  {path: 'user', component: AccountComponent, children: accountRoutes},
  {path: 'admin', component: AdminComponent,
                        canActivate: [FetchAuthInfoGuard, AuthGuard, AdminGuard, ], children: adminRoutes},
  {path: 'containers/add', component: AddContainerComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, FetchAuthInfoGuard, AuthGuard, AssistantGuard,  ] },
  {path: 'containers/search', component: SampleSearchComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, FetchAuthInfoGuard, AuthGuard, ], pathMatch: 'full' },
  {path: 'containers/overview/:id', component: ContainerOverviewComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, FetchAuthInfoGuard, AuthGuard, ] },
  {path: 'containers/overview/addbox/:id', component: ContainerBoxAddComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, FetchAuthInfoGuard, AuthGuard, ] },
  {path: 'containers/overview/movebox/:id', component: ContainerBoxMoveComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, FetchAuthInfoGuard, AuthGuard, ] },
  {path: 'containers/edit/:id', component: EditContainerComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, FetchAuthInfoGuard, AuthGuard, AssistantGuard, ] },
  {path: 'containers/delete/:id', component: DeleteContainerComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, FetchAuthInfoGuard, AuthGuard, AssistantGuard, ] },
  {path: 'containers/:id', component: ContainerBoxListComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, FetchAuthInfoGuard, AuthGuard, ] },
  {path: 'containers/:id/upload', component: ContainerSampleUploadComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, ContainerSampleUploadGuard,
                          FetchAuthInfoGuard, AuthGuard, AssistantGuard ] },
  {path: 'containers/:ct_pk/:box_pos', component: BoxDetailComponent, canActivate: [AppActiveGuard, GroupCountGuard,
                          FetchAuthInfoGuard, AuthGuard, ] },
  {path: 'containers/:ct_pk/:box_pos/move_samples', component: MoveSampleComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, FetchAuthInfoGuard, AuthGuard, ] },
  {path: 'containers/:ct_pk/:box_pos/store_samples', component: StoreSampleComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, FetchAuthInfoGuard, AuthGuard, ] },
  {path: 'containers/:ct_pk/:box_pos/:sp_pk', component: CsampleManageComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, FetchAuthInfoGuard, AuthGuard, ] },
  {path: 'containers/:ct_pk/:box_pos/manage', component: BoxManageComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, FetchAuthInfoGuard, AuthGuard, ] },
  {path: 'containers', component: MyContainerListComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, FetchAuthInfoGuard, AuthGuard, ] },
  {path: 'ctypes', component: CtypeComponent,
                        canActivate: [AppActiveGuard, GroupCountGuard, FetchAuthInfoGuard, AuthGuard ], children: ctypeRoutes},
  {path: 'denied', component: PermissionDeniedComponent},
  {path: '**', component: PageNotFoundComponent}
]
