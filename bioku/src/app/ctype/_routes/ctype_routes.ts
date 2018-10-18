import { Routes } from '@angular/router';

import { CtypeListComponent } from '../ctype-list/ctype-list.component';
import { CtypeAddComponent } from '../ctype-add/ctype-add.component';
import { CtypeDeleteComponent } from '../ctype-delete/ctype-delete.component';
import { CtypeAttrDetailComponent } from '../ctype-attr-detail/ctype-attr-detail.component';
import { CtypeAttrAddComponent } from '../ctype-attr-add/ctype-attr-add.component';
import { CtypeAttrEditComponent } from '../ctype-attr-edit/ctype-attr-edit.component';
import { CtypeAttrDeleteComponent } from '../ctype-attr-delete/ctype-attr-delete.component';
import { CtypeEditComponent } from '../ctype-edit/ctype-edit.component';
import { CtypeSubattrDetailComponent } from '../ctype-subattr-detail/ctype-subattr-detail.component';
import { CtypeSubattrAddComponent } from '../ctype-subattr-add/ctype-subattr-add.component';
import { CtypeSubattrEditComponent } from '../ctype-subattr-edit/ctype-subattr-edit.component';
import { CtypeSubattrDeleteComponent } from '../ctype-subattr-delete/ctype-subattr-delete.component';
import { CtypeDetailComponent } from '../ctype-detail/ctype-detail.component';
// guards
import { AssistantGuard } from '../../_guards/AssistantGuard';

const ctypeAttrChildRoutes: Routes = [
    // subattr
    {path: 'add_subattr', component: CtypeSubattrAddComponent, canActivate: [AssistantGuard, ] },
    {path: ':subattr_pk/edit', component: CtypeSubattrEditComponent, canActivate: [AssistantGuard, ] },
    {path: ':subattr_pk/delete', component: CtypeSubattrDeleteComponent, canActivate: [AssistantGuard, ] }
];

const ctypeChildRoutes: Routes = [
    // ctype
    {path: 'edit', component: CtypeEditComponent, canActivate: [AssistantGuard, ] },
    {path: 'delete', component: CtypeDeleteComponent, canActivate: [AssistantGuard, ] },
    // attr
    {path: 'add_attr', component: CtypeAttrAddComponent, canActivate: [AssistantGuard, ] },
    {path: ':attr_pk', component: CtypeAttrDetailComponent, canActivate: [AssistantGuard, ],
    children: ctypeAttrChildRoutes},
    {path: ':attr_pk/edit', component: CtypeAttrEditComponent, canActivate: [AssistantGuard, ] },
    {path: ':attr_pk/delete', component: CtypeAttrDeleteComponent, canActivate: [AssistantGuard, ] },
];

export const ctypeRoutes: Routes = [
    // ctype
    {path: '', component: CtypeListComponent, canActivate: [AssistantGuard, ] },
    {path: 'add', component: CtypeAddComponent, canActivate: [AssistantGuard, ] },
    {path: ':pk', component: CtypeDetailComponent, canActivate: [AssistantGuard, ],
    children: ctypeChildRoutes }
];

