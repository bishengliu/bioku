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

const ctypeSubAttrChildRoutes: Routes = [
    // subattr
    {path: 'edit', component: CtypeSubattrEditComponent, canActivate: [AssistantGuard, ] },
    {path: 'delete', component: CtypeSubattrDeleteComponent, canActivate: [AssistantGuard, ] },
];


const ctypeAttrChildRoutes: Routes = [
    // attr
    {path: 'edit', component: CtypeAttrEditComponent, canActivate: [AssistantGuard, ] },
    {path: 'delete', component: CtypeAttrDeleteComponent, canActivate: [AssistantGuard, ] },

    // subattr
    {path: 'add_subattr', component: CtypeSubattrAddComponent, canActivate: [AssistantGuard, ] },
    {path: ':subattr_pk', component: CtypeSubattrDetailComponent, canActivate: [AssistantGuard, ],
    children: ctypeSubAttrChildRoutes}
];

const ctypeChildRoutes: Routes = [
    // ctype
    {path: 'edit', component: CtypeEditComponent, canActivate: [AssistantGuard, ] },
    {path: 'delete', component: CtypeDeleteComponent, canActivate: [AssistantGuard, ] },
    // attr
    {path: 'add_attr', component: CtypeAttrAddComponent, canActivate: [AssistantGuard, ] },
    {path: 'attr/:attr_pk', component: CtypeAttrDetailComponent, canActivate: [AssistantGuard, ],
    children: ctypeAttrChildRoutes}
];

export const ctypeRoutes: Routes = [
    // ctype
    {path: '', component: CtypeListComponent, canActivate: [AssistantGuard, ] },
    {path: 'add', component: CtypeAddComponent, canActivate: [AssistantGuard, ] },
    {path: ':pk', component: CtypeDetailComponent, canActivate: [AssistantGuard, ],
    children: ctypeChildRoutes }
];

