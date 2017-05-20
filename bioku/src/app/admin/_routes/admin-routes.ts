//routing
import { Routes } from '@angular/router';
import { AdminComponent } from '../admin.component';
//groups
import { GroupListComponent } from '../groups/group-list/group-list.component';
import { AddGroupComponent } from '../groups/add-group/add-group.component';
import { EditGroupComponent } from '../groups/edit-group/edit-group.component';
import { DeleteGroupComponent } from '../groups/delete-group/delete-group.component';
//users
import { UserListComponent } from '../users/user-list/user-list.component';
//guards
import { AuthGuard } from  '../../_guards/AuthGuard';
import { AdminGuard } from  '../../_guards/AdminGuard';
//childRoutes
//, canActivate: [AuthGuard, AdminGuard]
//const groupsRoutes: Routes =[];
//const usersRoutes: Routes =[];
export const adminRoutes: Routes = [  
  {path: 'groups', component: GroupListComponent, canActivate: [AuthGuard, AdminGuard, ] },
  {path: 'groups/add', component: AddGroupComponent, canActivate: [AuthGuard, AdminGuard, ] },
  {path: 'groups/edit/:id', component: EditGroupComponent, canActivate: [AuthGuard, AdminGuard, ] },
  {path: 'groups/delete/:id', component: DeleteGroupComponent, canActivate: [AuthGuard, AdminGuard, ] },
  {path: 'users', component: UserListComponent, canActivate: [AuthGuard, AdminGuard, ] },
]