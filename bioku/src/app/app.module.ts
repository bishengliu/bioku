import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//color picker
//https://www.npmjs.com/package/ng2-color-picker
import { ColorPickerModule } from 'ng2-color-picker';
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
//UtilityServiceProvider
import { UtilityServiceProvider } from './_providers/UtilityServiceProvider';
//custom form validators
import {CustomFormValidatorsProvider} from './_providers/CustomFormValidatorsProvider';
//mydatepicker
import { MyDatePickerModule } from 'mydatepicker';
//redux
import { StoreProviders } from './_providers/ReduxProviders';
import { LogerProvider } from './_providers/LogAppStateProvider';
//angular2-useful-swiper
import { SwiperModule } from 'angular2-useful-swiper'; //npm install --save angular2-useful-swiper
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
import { AlertComponent } from './_helpers/alert/alert.component';
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
import { ContainerDetailComponent } from './containers/container-detail/container-detail.component';
import { ContainerBoxListComponent } from './containers/container-box-list/container-box-list.component';
import { BoxDetailComponent } from './containers/box-detail/box-detail.component';
import { MyContainerListComponent } from './containers/my-container-list/my-container-list.component';
import { FooterComponent } from './_helpers/footer/footer.component';
import { TopNavbarComponent } from './_helpers/top-navbar/top-navbar.component';
import { ContainerBoxesFilterComponent } from './containers/container-boxes-filter/container-boxes-filter.component';
import { ContainerBoxNavbarComponent } from './containers/container-box-navbar/container-box-navbar.component';
import { ContainerBoxCardviewComponent } from './containers/container-box-cardview/container-box-cardview.component';
import { BoxLayoutComponent } from './containers/box-layout/box-layout.component';
import { SampleFilterComponent } from './containers/sample-filter/sample-filter.component';
import { SampleTableComponent } from './containers/sample-table/sample-table.component';
import { BoxDetailActionPanelComponent } from './containers/box-detail-action-panel/box-detail-action-panel.component';
import { BoxLayoutSimpleComponent } from './containers/box-layout-simple/box-layout-simple.component';
// import { ContainerAddBoxComponent } from './containers/container-add-box/container-add-box.component';
import { ContainerOverviewComponent } from './containers/container-overview/container-overview.component';
import { ContainerBoxOverviewComponent } from './containers/container-box-overview/container-box-overview.component';
import { ContainerBoxOverviewActionPanelComponent } from './containers/container-box-overview-action-panel/container-box-overview-action-panel.component';
import { ContainerBoxAddComponent } from './containers/container-box-add/container-box-add.component';
import { ContainerBoxMoveComponent } from './containers/container-box-move/container-box-move.component';


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
    AlertComponent,
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
    ContainerDetailComponent,
    ContainerBoxListComponent,
    BoxDetailComponent,
    MyContainerListComponent,
    FooterComponent,
    TopNavbarComponent,
    ContainerBoxesFilterComponent,
    ContainerBoxNavbarComponent,
    ContainerBoxCardviewComponent,
    BoxLayoutComponent,
    SampleFilterComponent,
    SampleTableComponent,
    BoxDetailActionPanelComponent,
    BoxLayoutSimpleComponent,
    // ContainerAddBoxComponent,
    ContainerOverviewComponent,
    ContainerBoxOverviewComponent,
    ContainerBoxOverviewActionPanelComponent,
    ContainerBoxAddComponent,
    ContainerBoxMoveComponent,
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
    //ColorPickerModule
    ColorPickerModule,
    //sidebar
    SidebarModule.forRoot(),
    //register root routers
    RouterModule.forRoot(routes),
    //npm install --save angular2-useful-swiper
    SwiperModule,
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
    UtilityServiceProvider,
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
