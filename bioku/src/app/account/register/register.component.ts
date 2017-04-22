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
              @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private router: Router, private logAppStateService: LogAppStateService) 
  { 
    //validator patterns
    let username_pattern = new RegExp("^([a-zA-Z]+[0-9_-]*){6,}$");
    let password_pattern = new RegExp("^(?=.*[A-Z])(?=.*[a-z].*[a-z])(?=.*[0-9].*[0-9]).{8,}$");
    let human_name_pattern = new RegExp("^[a-zA-Z]+([a-zA-Z]+[0-9_\\-.\\s]*){1,}$");
    let filename_pattern = new RegExp("^([a-zA-Z]+[0-9_\\-.\\s&%$#@()\\[\\]\\|\\^]*){4,}$");
    let telephone_pattern = new RegExp("^([0-9]){4,}$");
    this.registerForm = fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.pattern(username_pattern)])],
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'password1': ['', Validators.compose([Validators.required, Validators.pattern(password_pattern)])],
      'password2': ['', Validators.compose([Validators.required, Validators.pattern(password_pattern)])],
      'first_name': ['', Validators.compose([Validators.required, Validators.pattern(human_name_pattern)])],
      'last_name': ['', Validators.compose([Validators.required, Validators.pattern(human_name_pattern)])],
      'birth_date': ['', ],
      'photo': ['', Validators.pattern(filename_pattern)],
      'telephone': ['', Validators.pattern(telephone_pattern)],
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
