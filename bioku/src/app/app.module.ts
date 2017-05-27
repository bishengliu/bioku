import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//symantic -ui
//https://edcarroll.github.io/ng2-semantic-ui/#/getting-started
//sidebar: https://www.npmjs.com/package/ng-sidebar
import { SidebarModule } from 'ng-sidebar';

import {SuiModule} from 'ng2-semantic-ui';
//routing
import { RouterModule} from '@angular/router';
//app root routes
import { routes } from './_routes/root-routes';
//providers
import {AlertServiceProvider} from './_providers/AlertServiceProvider';
import {AppSettingProvider} from './_providers/AppSettingProvider';
import {APIServiceProviders} from './_providers/APIServiceProviders';
import { GuardProviders } from './_providers/GuardProviders';
//custom form validators
import {CustomFormValidatorsProvider} from './_providers/CustomFormValidatorsProvider';
//mydatepicker
import { MyDatePickerModule } from 'mydatepicker';
//redux
import { StoreProviders } from './_providers/ReduxProviders';
import { LogerProvider } from './_providers/LogAppStateProvider';
//all components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { AccountComponent } from './account/account.component';
import { RegisterComponent } from './account/register/register.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { ProfileComponent } from './account/profile/profile.component';
import { PageNotFoundComponent } from './_helpers/page-not-found/page-not-found.component';
import { LoginComponent } from './account/login/login.component';
import { HomeHeaderComponent } from './home/home-header/home-header.component';
import { HomeFooterComponent } from './home/home-footer/home-footer.component';
import { AlertComponent } from './_helpers/alert/alert.component';
import { HomeBodyComponent } from './home/home-body/home-body.component';
import { GroupComponent } from './account/group/group.component';
import { PermissionDeniedComponent } from './_helpers/permission-denied/permission-denied.component';
import { GroupListComponent } from './admin/groups/group-list/group-list.component';
import { AddGroupComponent } from './admin/groups/add-group/add-group.component';
import { EditGroupComponent } from './admin/groups/edit-group/edit-group.component';
import { DeleteGroupComponent } from './admin/groups/delete-group/delete-group.component';
import { UserListComponent } from './admin/users/user-list/user-list.component';
import { ContainerListComponent } from './admin/containers/container-list/container-list.component';
import { AddContainerComponent } from './admin/containers/add-container/add-container.component';
import { EditContainerComponent } from './admin/containers/edit-container/edit-container.component';
import { DeleteContainerComponent } from './admin/containers/delete-container/delete-container.component';
import { ContainersSiderbarComponent } from './containers/containers-siderbar/containers-siderbar.component';
import { ContainerDetailComponent } from './containers/container-detail/container-detail.component';
import { ContainerBoxListComponent } from './containers/container-box-list/container-box-list.component';
import { BoxDetailComponent } from './containers/box-detail/box-detail.component';
import { SampleListComponent } from './containers/sample-list/sample-list.component';
import { SampleDetailComponent } from './containers/sample-detail/sample-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    AccountComponent,
    RegisterComponent,
    ChangePasswordComponent,
    ProfileComponent,
    PageNotFoundComponent,
    LoginComponent,
    HomeHeaderComponent,
    HomeFooterComponent,
    AlertComponent,
    HomeBodyComponent,
    GroupComponent,
    PermissionDeniedComponent,
    GroupListComponent,
    AddGroupComponent,
    EditGroupComponent,
    DeleteGroupComponent,
    UserListComponent,
    ContainerListComponent,
    AddContainerComponent,
    EditContainerComponent,
    DeleteContainerComponent,
    ContainersSiderbarComponent,
    ContainerDetailComponent,
    ContainerBoxListComponent,
    BoxDetailComponent,
    SampleListComponent,
    SampleDetailComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    //symantic -ui
    SuiModule,
    //mydatepicker
    MyDatePickerModule,
    //sidebar
    SidebarModule.forRoot(),
    //register root routers
    RouterModule.forRoot(routes),
  ],
  providers: [
    //guards
    GuardProviders,
    AlertServiceProvider, 
    AppSettingProvider,
    StoreProviders,
    APIServiceProviders,
    LogerProvider,
    CustomFormValidatorsProvider,
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
