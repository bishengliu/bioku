//routing
import { Routes } from '@angular/router';
import { AdminComponent } from '../admin.component';
import { GroupListComponent } from '../groups/group-list//group-list.component';
//guards
import { AuthGuard } from  '../../_guards/AuthGuard';
import { AdminGuard } from  '../../_guards/AdminGuard';
//childRoutes
//, canActivate: [AuthGuard, AdminGuard]
const groupsRoutes: Routes =[];
const usersRoutes: Routes =[];
export const adminRoutes: Routes = [
  {path: 'groups', component: GroupListComponent, canActivate: [AuthGuard, AdminGuard, ], children: groupsRoutes},
  {path: 'users', component: AdminComponent, canActivate: [AuthGuard, AdminGuard, ], children: usersRoutes}
]