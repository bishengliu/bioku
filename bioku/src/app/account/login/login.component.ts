import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators} from '@angular/forms';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {Store} from 'redux';
import{AlertService} from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
//redux
import {AuthStore} from '../../_providers/ReduxProviders';
import {AuthState} from '../../_redux/login/login_state';
import {LOGIN_CONSTANTS as C } from '../../_redux/login/login_constants';
import {SetAuthUserAction, SetAuthTokenAction, setAuthUserActionCreator, setAuthTokenActionCreator, userAuthActionAsync} from '../../_redux/login/login_actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  appName: string;

  constructor(fb: FormBuilder, private alertService: AlertService, private http: Http, @Inject(APP_CONFIG) private appSetting: any, @Inject(AuthStore) private authStore: Store<AuthState>) { 
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
    this.authStore.dispatch(userAuthActionAsync(this.http, this.appSetting, values.username, values.password));

  }

  ngOnInit() {
  }

}
