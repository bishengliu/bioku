import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators} from '@angular/forms';
import {Store} from 'redux';
import{AlertService} from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
//redux
import {AuthStore} from '../../_providers/ReduxProviders';
import {AuthStatus} from '../../_redux/login/login_state';
import {LOGIN_CONSTANTS as C } from '../../_redux/login/login_constants';
import {SetAuthUserAction, SetAuthTokenAction, SetAuthUserActionCreator, SetAuthTokenActionCreator} from '../../_redux/login/login_actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  appName: string;

  constructor(fb: FormBuilder, private alertService: AlertService, @Inject(APP_CONFIG) appSetting: any, @Inject(AuthStore) private authStore: Store<AuthStatus>) { 
    this.loginForm = fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
    //app name
    this.appName = appSetting.NAME;
  }

  onSubmit(values: any): void{
    this.alertService.success('form posted!');
    console.log(this.loginForm);
    console.log(values);
    //use redux-chunk

    //hard-coded test of redux
    //authUser
    let authUser = {
    id: 1,
    name: 'bisheng',
    first_name: 'Bisheng',
    last_name: 'Liu',
    photo_url: 'url',
    telephone: 12345,
    roles: ['Admin', 'PI'],
    groups: [1, 2],
    }
    let setAuthUserAction: SetAuthUserAction = SetAuthUserActionCreator(authUser);
    this.authStore.dispatch(setAuthUserAction);

    //token
    let setAuthTokenAction: SetAuthTokenAction = SetAuthTokenActionCreator('dwegergrtebhsfjksahdwkjflhw');
    this.authStore.dispatch(setAuthTokenAction);


    
  }

  ngOnInit() {
  }

}
