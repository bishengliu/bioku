import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

///////////////// 3rd party modules /////////////////////
// color picker
// https://www.npmjs.com/package/ng2-color-picker
import { ColorPickerModule } from 'ng2-color-picker';
// symantic -ui
// https://edcarroll.github.io/ng2-semantic-ui/#/getting-started
import { SuiModule } from 'ng2-semantic-ui';
// sidebar
// https://www.npmjs.com/package/ng-sidebar
import { SidebarModule } from 'ng-sidebar';
// mydatepicker
// https://github.com/kekeh/mydatepicker
import { MyDatePickerModule } from 'mydatepicker';
// dragula
// https://github.com/bevacqua/angularjs-dragula
import { DragulaModule } from 'ng2-dragula';
// angular2-useful-swiper
// import { SwiperModule } from 'angular2-useful-swiper'; //npm install --save angular2-useful-swiper
// ng2-sticky: https://www.npmjs.com/package/ng2-sticky
// import { Ng2StickyModule } from 'ng2-sticky';
// sheetJS
// import { SheetJSComponent } from './sheetjs.component';
///////////////////// end 3rd party modules //////////////
// routing
import { RouterModule} from '@angular/router';
// app root routes
import { routes } from './_routes/root-routes';
// custom providers
import {AlertServiceProvider} from './_providers/AlertServiceProvider';
import {AppSettingProvider} from './_providers/AppSettingProvider';
import {APIServiceProviders} from './_providers/APIServiceProviders';
import { GuardProviders } from './_providers/GuardProviders';
import { LocalStorageServiceProvider } from './_providers/LocalStorageServiceProvider';
import { UtilityServiceProvider } from './_providers/UtilityServiceProvider';
// custom form validators
import {CustomFormValidatorsProvider} from './_providers/CustomFormValidatorsProvider';
// redux
import { StoreProviders } from './_providers/ReduxProviders';
import { LogerProvider } from './_providers/LogAppStateProvider';

// all components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { AccountComponent } from './account/account.component';
import { RegisterComponent } from './account/register/register.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { ProfileComponent } from './account/profile/profile.component';
import { PageNotFoundComponent } from './_helpers/page-not-found/page-not-found.component';
import { LoginComponent } from './account/login/login.component';
import { AlertComponent } from './_helpers/alert/alert.component';
import { GroupComponent } from './account/group/group.component';
import { PermissionDeniedComponent } from './_helpers/permission-denied/permission-denied.component';
import { GroupListComponent } from './admin/groups/group-list/group-list.component';
import { AddGroupComponent } from './admin/groups/add-group/add-group.component';
import { EditGroupComponent } from './admin/groups/edit-group/edit-group.component';
import { DeleteGroupComponent } from './admin/groups/delete-group/delete-group.component';
import { UserListComponent } from './admin/users/user-list/user-list.component';
import { ContainerListComponent } from './admin/containers/container-list/container-list.component';
import { AddContainerComponent } from './admin/containers/add-container/add-container.component';
import { EditContainerComponent } from './admin/containers/edit-container/edit-container.component';
import { DeleteContainerComponent } from './admin/containers/delete-container/delete-container.component';
import { ContainerDetailComponent } from './containers/container-detail/container-detail.component';
import { ContainerBoxListComponent } from './containers/container-box-list/container-box-list.component';
import { BoxDetailComponent } from './containers/box-detail/box-detail.component';
import { MyContainerListComponent } from './containers/my-container-list/my-container-list.component';
import { FooterComponent } from './_helpers/footer/footer.component';
import { TopNavbarComponent } from './_helpers/top-navbar/top-navbar.component';
import { ContainerBoxesFilterComponent } from './containers/container-boxes-filter/container-boxes-filter.component';
import { ContainerBoxNavbarComponent } from './containers/container-box-navbar/container-box-navbar.component';
import { ContainerBoxCardviewComponent } from './containers/container-box-cardview/container-box-cardview.component';
import { BoxLayoutComponent } from './containers/box-layout/box-layout.component';
import { SampleFilterComponent } from './containers/sample-filter/sample-filter.component';
import { SampleTableComponent } from './containers/sample-table/sample-table.component';
import { BoxDetailActionPanelComponent } from './containers/box-detail-action-panel/box-detail-action-panel.component';
import { BoxLayoutSimpleComponent } from './containers/box-layout-simple/box-layout-simple.component';
import { ContainerOverviewComponent } from './containers/container-overview/container-overview.component';
import { ContainerBoxOverviewComponent } from './containers/container-box-overview/container-box-overview.component';
// tslint:disable-next-line:max-line-length
import { ContainerBoxOverviewActionPanelComponent } from './containers/container-box-overview-action-panel/container-box-overview-action-panel.component';
import { ContainerBoxAddComponent } from './containers/container-box-add/container-box-add.component';
import { ContainerBoxMoveComponent } from './containers/container-box-move/container-box-move.component';
import { SampleDetailComponent } from './containers/sample-detail/sample-detail.component';
import { MoveSampleComponent } from './containers/move-sample/move-sample.component';
import { StoreSampleComponent } from './containers/store-sample/store-sample.component';
import { StoreSampleFormComponent } from './containers/store-sample-form/store-sample-form.component';
import { SampleSearchComponent } from './containers/sample-search/sample-search.component';
import { SampleSearchFormComponent } from './containers/sample-search-form/sample-search-form.component';
import { SampleSearchResultComponent } from './containers/sample-search-result/sample-search-result.component';
import { SampleSearchActionPanelComponent } from './containers/sample-search-action-panel/sample-search-action-panel.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { ResetPasswordComponent } from './account/reset-password/reset-password.component';
import { XlsxUploadComponent } from './containers/xlsx-upload/xlsx-upload.component';
import { FileDropDirective } from './_directives/file-drop/file-drop.directive'; // driective
import { ContainerSampleUploadComponent } from './containers/container-sample-upload/container-sample-upload.component';
import { ContainerSampleUploadHelperComponent } from './containers/container-sample-upload-helper/container-sample-upload-helper.component';
// tslint:disable-next-line:max-line-length
import { ContainerSampleUploaderStepOneComponent } from './containers/container-sample-uploader-step-one/container-sample-uploader-step-one.component';
import { ContainerSampleUploaderStepTwoComponent } from './containers/container-sample-uploader-step-two/container-sample-uploader-step-two.component';
// tslint:disable-next-line:max-line-length
import { ContainerSampleUploaderStepThreeComponent } from './containers/container-sample-uploader-step-three/container-sample-uploader-step-three.component';
import { ContainerSampleUploaderValidateSaveComponent } from './containers/container-sample-uploader-validate-save/container-sample-uploader-validate-save.component';
import { ContainerBoxFullnessviewComponent } from './containers/container-box-fullnessview/container-box-fullnessview.component';
import { SampleDetailModelComponent } from './containers/sample-detail-model/sample-detail-model.component';
import { SampleDeepFilterComponent } from './containers/sample-deep-filter/sample-deep-filter.component';
import { ExportSampleDirective } from './_directives/export-sample/export-sample.directive';
import { BoxManageComponent } from './containers/box-manage/box-manage.component';
import { CtypeAddComponent } from './ctype/ctype-add/ctype-add.component';
import { CtypeDeleteComponent } from './ctype/ctype-delete/ctype-delete.component';
import { CtypeAttrAddComponent } from './ctype/ctype-attr-add/ctype-attr-add.component';
import { CtypeAttrEditComponent } from './ctype/ctype-attr-edit/ctype-attr-edit.component';
import { CtypeAttrDeleteComponent } from './ctype/ctype-attr-delete/ctype-attr-delete.component';
import { CtypeEditComponent } from './ctype/ctype-edit/ctype-edit.component';
import { CtypeSubattrListComponent } from './ctype/ctype-subattr-list/ctype-subattr-list.component';
import { CtypeSubattrAddComponent } from './ctype/ctype-subattr-add/ctype-subattr-add.component';
import { CtypeSubattrEditComponent } from './ctype/ctype-subattr-edit/ctype-subattr-edit.component';
import { CtypeSubattrDeleteComponent } from './ctype/ctype-subattr-delete/ctype-subattr-delete.component';
import { CtypeComponent } from './ctype/ctype.component';
import { CtypeListComponent } from './ctype/ctype-list/ctype-list.component';
import { CtypeDetailComponent } from './ctype/ctype-detail/ctype-detail.component';
import { CtypeAttrDetailComponent } from './ctype/ctype-attr-detail/ctype-attr-detail.component';

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
    AlertComponent,
    GroupComponent,
    PermissionDeniedComponent,
    GroupListComponent,
    AddGroupComponent,
    EditGroupComponent,
    DeleteGroupComponent,
    UserListComponent,
    ContainerListComponent,
    AddContainerComponent,
    EditContainerComponent,
    DeleteContainerComponent,
    ContainerDetailComponent,
    ContainerBoxListComponent,
    BoxDetailComponent,
    MyContainerListComponent,
    FooterComponent,
    TopNavbarComponent,
    ContainerBoxesFilterComponent,
    ContainerBoxNavbarComponent,
    ContainerBoxCardviewComponent,
    BoxLayoutComponent,
    SampleFilterComponent,
    SampleTableComponent,
    BoxDetailActionPanelComponent,
    BoxLayoutSimpleComponent,
    ContainerOverviewComponent,
    ContainerBoxOverviewComponent,
    ContainerBoxOverviewActionPanelComponent,
    ContainerBoxAddComponent,
    ContainerBoxMoveComponent,
    SampleDetailComponent,
    MoveSampleComponent,
    StoreSampleComponent,
    StoreSampleFormComponent,
    SampleSearchComponent,
    SampleSearchFormComponent,
    SampleSearchResultComponent,
    SampleSearchActionPanelComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    XlsxUploadComponent,
    FileDropDirective,
    ContainerSampleUploadComponent,
    ContainerSampleUploadHelperComponent,
    ContainerSampleUploaderStepOneComponent,
    ContainerSampleUploaderStepTwoComponent,
    ContainerSampleUploaderStepThreeComponent,
    ContainerSampleUploaderValidateSaveComponent,
    ContainerBoxFullnessviewComponent,
    SampleDetailModelComponent,
    SampleDeepFilterComponent,
    ExportSampleDirective,
    BoxManageComponent,
    CtypeAddComponent,
    CtypeDeleteComponent,
    CtypeAttrAddComponent,
    CtypeAttrEditComponent,
    CtypeAttrDeleteComponent,
    CtypeEditComponent,
    CtypeSubattrListComponent,
    CtypeSubattrAddComponent,
    CtypeSubattrEditComponent,
    CtypeSubattrDeleteComponent,
    CtypeComponent,
    CtypeListComponent,
    CtypeDetailComponent,
    CtypeAttrDetailComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    //////////////// 3rd party modules///////////////
    // symantic -ui
    SuiModule,
    // mydatepicker
    MyDatePickerModule,
    // ColorPickerModule
    ColorPickerModule,
    // sidebar
    SidebarModule.forRoot(),
    // register root routers
    RouterModule.forRoot(routes, { enableTracing: false }),
    // npm install --save angular2-useful-swiper
    // SwiperModule,
    // dragula
    DragulaModule,
    // ng2-sticky
    // Ng2StickyModule,
    // xlsx
    // https://www.npmjs.com/package/xlsx
    // https://github.com/SheetJS/js-xlsx/tree/825830d1cd18374cf38576f274c8535c1f099ac9/demos/angular2
    //////////////// end 3rd party modules///////////////
  ],
  providers: [
    // guards
    GuardProviders,
    AlertServiceProvider,
    AppSettingProvider,
    StoreProviders,
    APIServiceProviders,
    LogerProvider,
    CustomFormValidatorsProvider,
    UtilityServiceProvider,
    LocalStorageServiceProvider,
    ],
  entryComponents: [
    // SampleDetailModelComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
