import { Routes } from '@angular/router';

import { CtypeListComponent } from '../ctype-list/ctype-list.component';
import { CtypeAddComponent } from '../ctype-add/ctype-add.component';
import { CtypeDeleteComponent } from '../ctype-delete/ctype-delete.component';
import { CtypeAttrListComponent } from '../ctype-attr-list/ctype-attr-list.component';
import { CtypeAttrAddComponent } from '../ctype-attr-add/ctype-attr-add.component';
import { CtypeAttrEditComponent } from '../ctype-attr-edit/ctype-attr-edit.component';
import { CtypeAttrDeleteComponent } from '../ctype-attr-delete/ctype-attr-delete.component';
import { CtypeEditComponent } from '../ctype-edit/ctype-edit.component';
import { CtypeSubattrListComponent } from '../ctype-subattr-list/ctype-subattr-list.component';
import { CtypeSubattrAddComponent } from '../ctype-subattr-add/ctype-subattr-add.component';
import { CtypeSubattrEditComponent } from '../ctype-subattr-edit/ctype-subattr-edit.component';
import { CtypeSubattrDeleteComponent } from '../ctype-subattr-delete/ctype-subattr-delete.component';
import { CtypeDetailComponent } from '../ctype-detail/ctype-detail.component';
// guards
import { AssistantGuard } from '../../_guards/AssistantGuard';

export const ctypeChildRoutes: Routes = [
    // ctype
    {path: 'edit', component: CtypeEditComponent, canActivate: [AssistantGuard, ] },
    {path: 'delete', component: CtypeDeleteComponent, canActivate: [AssistantGuard, ] },
    // attr
    {path: 'add_attr', component: CtypeAttrAddComponent, canActivate: [AssistantGuard, ] },
    {path: 'attr/:attr_pk', component: CtypeAttrListComponent, canActivate: [AssistantGuard, ] },
];

export const ctypeRoutes: Routes = [
    // ctype
    {path: '', component: CtypeListComponent, canActivate: [AssistantGuard, ] },
    {path: 'add', component: CtypeAddComponent, canActivate: [AssistantGuard, ] },
    {path: ':pk', component: CtypeDetailComponent, canActivate: [AssistantGuard, ], children: ctypeChildRoutes },
    // attr
    {path: 'attr/:type_pk/edit/:attr_pk', component: CtypeAttrEditComponent, canActivate: [AssistantGuard, ] },
    {path: 'attr/:type_pk/delete/:attr_pk', component: CtypeAttrDeleteComponent, canActivate: [AssistantGuard, ] },
    // subattr
    {path: 'subattr/:type_pk/:attr_pk', component: CtypeSubattrListComponent, canActivate: [AssistantGuard, ] },
    {path: 'subattr/:type_pk/:attr_pk/add', component: CtypeSubattrAddComponent, canActivate: [AssistantGuard, ] },
    {path: 'subattr/:type_pk/:attr_pk/edit/:subattr_pk', component: CtypeSubattrEditComponent, canActivate: [AssistantGuard, ] },
    {path: 'subattr/:type_pk/:attr_pk/delete/:subattr_pk', component: CtypeSubattrDeleteComponent, canActivate: [AssistantGuard, ] },
];

