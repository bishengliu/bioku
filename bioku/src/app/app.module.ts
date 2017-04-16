import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//symantic -ui
//https://edcarroll.github.io/ng2-semantic-ui/#/getting-started
import {SuiModule} from 'ng2-semantic-ui';
//routing
import { RouterModule} from '@angular/router';
//app root routes
import { routes } from './_routes/root-routes';

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
import { HomeAboutComponent } from './home/home-about/home-about.component';
import { HomeFeaturesComponent } from './home/home-features/home-features.component';

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
    HomeAboutComponent,
    HomeFeaturesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    //symantic -ui
    SuiModule,
    //register root routers
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
