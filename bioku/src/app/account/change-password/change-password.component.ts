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


//custom from validator
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  passwordForm: FormGroup;
  username: string;

  constructor(fb: FormBuilder, private alertService: AlertService, 
              @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private router: Router, 
              private logAppStateService: LogAppStateService, private cValidators: CustomFormValidators, private http: Http)
  { 
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();

    //formGroup
    this.passwordForm = fb.group({
      'old_password': ['', Validators.required, this.cValidators.currentPasswordAsyncValidator(this.username)],
      'password1': ['', Validators.compose([Validators.required, this.cValidators.passwordValidator()])],
      'password2': ['', Validators.compose([Validators.required, this.cValidators.passwordValidator()])]
    });   
  }

  updateState(){ 
    let state= this.appStore.getState();
    if(state.authInfo&& state.authInfo.authUser){
      this.username=state.authInfo.authUser.username;
    }
  }

  ngOnInit() {
  }

}
