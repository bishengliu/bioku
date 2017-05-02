import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators} from '@angular/forms';
import { Http } from '@angular/http';
import { Router} from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { LoginService } from '../../_services/LoginService';
import { LogAppStateService } from '../../_services/LogAppStateService';
import { User } from '../../_classes/User';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
import { REDUX_CONSTANTS as C } from '../../_redux/root/constants';
import {SetAuthUserAction, SetAuthTokenAction, setAuthUserActionCreator, setAuthTokenActionCreator, userAuthActionAsync} from '../../_redux/account/account_actions';

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

  constructor(fb: FormBuilder, private alertService: AlertService, private loginService: LoginService, 
              @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private router: Router, private logAppStateService: LogAppStateService) { 
    this.loginForm = fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
    //app name
    this.appName = appSetting.NAME;
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();
  }

  onLogin(values: any): void{
    //console.log(this.loginForm);
    //console.log(values);
    //use redux-chunk call async action
    this.appStore.dispatch(userAuthActionAsync(this.loginService, values.username, values.password, this.alertService, this.logAppStateService));
  }

  updateState(){
    let state= this.appStore.getState()
    if(state.authInfo){
      this.user = state.authInfo.authUser;
      this.isLogin = state.authInfo.token? true: false;
    }
    if(this.isLogin){
      this.router.navigate(['/']); 
    }
  }
  ngOnInit() {
  }

}
