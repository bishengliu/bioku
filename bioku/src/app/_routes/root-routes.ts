
import { HomeComponent } from '../home/home.component';
import { AdminComponent } from '../admin/admin.component';
import { AccountComponent } from '../account/account.component';
import { RegisterComponent } from '../account/register/register.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { LoginComponent } from '../account/login/login.component';
import { HomeFeaturesComponent } from '../home/home-features/home-features.component';
//routing
import { Routes } from '@angular/router';
import { accountRoutes } from '../account/_routes/account-routes';

//app root routes
export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'features', component: HomeFeaturesComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user', component: AccountComponent, children: accountRoutes},
  {path: '**', component: PageNotFoundComponent}
]