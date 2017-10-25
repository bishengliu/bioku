// routing
import { Routes } from '@angular/router';
import { AdminComponent } from '../admin.component';
// groups
import { GroupListComponent } from '../groups/group-list/group-list.component';
import { AddGroupComponent } from '../groups/add-group/add-group.component';
import { EditGroupComponent } from '../groups/edit-group/edit-group.component';
import { DeleteGroupComponent } from '../groups/delete-group/delete-group.component';
// users
import { UserListComponent } from '../users/user-list/user-list.component';
// containers
import { ContainerListComponent } from '../containers/container-list/container-list.component';
import { AddContainerComponent } from '../containers/add-container/add-container.component';
import { EditContainerComponent } from '../containers/edit-container/edit-container.component';
import { DeleteContainerComponent } from '../containers/delete-container/delete-container.component';
// guards
import { AuthGuard } from '../../_guards/AuthGuard';
import { AdminGuard } from '../../_guards/AdminGuard';

export const adminRoutes: Routes = [
  // groups
  {path: 'groups', component: GroupListComponent, canActivate: [AuthGuard, AdminGuard, ] },
  {path: 'groups/add', component: AddGroupComponent, canActivate: [AuthGuard, AdminGuard, ] },
  {path: 'groups/edit/:id', component: EditGroupComponent, canActivate: [AuthGuard, AdminGuard, ] },
  {path: 'groups/delete/:id', component: DeleteGroupComponent, canActivate: [AuthGuard, AdminGuard, ] },
  // users
  {path: 'users', component: UserListComponent, canActivate: [AuthGuard, AdminGuard, ] },
  // containers
  {path: 'containers', component: ContainerListComponent, canActivate: [AuthGuard, AdminGuard, ] },
  {path: 'containers/add', component: AddContainerComponent, canActivate: [AuthGuard, AdminGuard, ] },
  {path: 'containers/edit/:id', component: EditContainerComponent, canActivate: [AuthGuard, AdminGuard, ] },
  {path: 'containers/delete/:id', component: DeleteContainerComponent, canActivate: [AuthGuard, AdminGuard, ] },
]
