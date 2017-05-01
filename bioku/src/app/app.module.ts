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
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './account/login/login.component';
import { HomeHeaderComponent } from './home/home-header/home-header.component';
import { HomeFooterComponent } from './home/home-footer/home-footer.component';
import { AlertComponent } from './_helpers/alert/alert.component';
import { HomeBodyComponent } from './home/home-body/home-body.component';


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
