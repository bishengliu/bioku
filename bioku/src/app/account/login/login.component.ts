import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators} from '@angular/forms';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {Store} from 'redux';
import { Router} from '@angular/router';
import{AlertService} from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import {LoginService} from '../../_services/LoginService';
import {User} from '../../_classes/User';
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
  isLogin: boolean = false;
  user: User = null;

  constructor(fb: FormBuilder, private alertService: AlertService, private loginService: LoginService, @Inject(APP_CONFIG) private appSetting: any, @Inject(AuthStore) private authStore: Store<AuthState>, private router: Router) { 
    this.loginForm = fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
    //app name
    this.appName = appSetting.NAME;

    //subscribe store state changes
    authStore.subscribe(()=> this.updateState());
    this.updateState();
  }

  onLogin(values: any): void{
    //console.log(this.loginForm);
    //console.log(values);
    //use redux-chunk call async action
    this.authStore.dispatch(userAuthActionAsync(this.loginService, values.username, values.password, this.alertService));
  }

  updateState(){
    let state= this.authStore.getState()
    this.user = state.authUser;
    this.isLogin = state.token? true: false;
    if(this.isLogin){
      this.router.navigate(['home']);
    }
  }
  ngOnInit() {
  }

}
