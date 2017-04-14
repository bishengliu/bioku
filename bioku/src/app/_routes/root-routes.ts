
import { HomeComponent } from '../home/home.component';
import { AdminComponent } from '../admin/admin.component';
import { AccountComponent } from '../account/account.component';
import { RegisterComponent } from '../account/register/register.component';

//routing
import { Routes } from '@angular/router';
import { accountRoutes } from '../account/_routes/account-routes';

//app root routes
export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user', component: AccountComponent, children: accountRoutes}
]