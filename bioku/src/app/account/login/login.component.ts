import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators} from '@angular/forms';
import { Http } from '@angular/http';
import { Router} from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { LoginService } from '../../_services/LoginService';
import { LogAppStateService } from '../../_services/LogAppStateService';
import { RefreshService } from '../../_services/RefreshService';
import { User } from '../../_classes/User';
import { Group } from '../../_classes/Group';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
import { REDUX_CONSTANTS as C } from '../../_redux/root/constants';
import { SetAuthUserAction, SetAuthTokenAction, setAuthUserActionCreator,
        setAuthTokenActionCreator, userAuthActionAsync,
        SetAuthGroupAction, setAuthGroupActionCreator } from '../../_redux/account/account_actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  appName: string;
  isLogin: Boolean = false;
  user: User = null;

  constructor(fb: FormBuilder, private alertService: AlertService, private loginService: LoginService,
              private refreshService: RefreshService,  @Inject(APP_CONFIG) private appSetting: any,
              @Inject(AppStore) private appStore, private router: Router, private logAppStateService: LogAppStateService) { 
    this.loginForm = fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
    // app name
    this.appName = appSetting.NAME;
    // subscribe store state changes
    appStore.subscribe(() => this.updateState());
    this.updateState();
  }

  onLogin(values: any): void {
    // use redux-chunk call async action
     this.appStore.dispatch(userAuthActionAsync(
       this.loginService, values.username, values.password, this.alertService, this.logAppStateService, this.refreshService));
  }

  updateState() {
    const state = this.appStore.getState()
    if (state.authInfo && state.authInfo.authUser != null) {
      this.user = state.authInfo.authUser;
      this.isLogin = state.authInfo.token ? true : false;
    } else {
      this.user = null;
      this.isLogin = false;
    }
    if (this.isLogin) {
      this.router.navigate(['/containers']);
    }
  }
  ngOnInit() {
    // remove localstorage
    this.refreshService.cleanState();
  }

}
