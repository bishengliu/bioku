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

//custom from validator
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  appName: string;
  isRegistered: boolean = false;
  user: User = null;

  constructor(fb: FormBuilder, private alertService: AlertService, 
              @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private router: Router, private logAppStateService: LogAppStateService, private cValidators: CustomFormValidators) 
  { 
    //validator patterns
    this.registerForm = fb.group({
      'username': ['', Validators.compose([Validators.required, this.cValidators.usernameValidator()])],
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'password1': ['', Validators.compose([Validators.required, this.cValidators.passwordValidator()])],
      'password2': ['', Validators.compose([Validators.required, this.cValidators.passwordValidator()])],
      'first_name': ['', Validators.compose([Validators.required, this.cValidators.humanNameValidator()])],
      'last_name': ['', Validators.compose([Validators.required, this.cValidators.humanNameValidator()])],
      'birth_date': ['', ],
      'photo': ['', ],
      'telephone': ['', this.cValidators.telephoneValidator()],
    });
    
    //app name
    this.appName = appSetting.NAME;
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();
    
  }

  onRegister(values: any): void{
    console.log(this.registerForm);
    console.log(values);
  }

  updateState(){
    let state= this.appStore.getState()
  }

  ngOnInit() {
  }

}
