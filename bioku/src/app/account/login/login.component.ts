import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators} from '@angular/forms';
import{AlertService} from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  appName: string;

  constructor(fb: FormBuilder, private alertService: AlertService, @Inject(AppSetting) appSetting: any ) { 
    this.loginForm = fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
    //app name
    this.appName = appSetting.NAME;
  }

  onSubmit(value: any): void{
    this.alertService.success('form posted!');
    console.log(this.loginForm);
    console.log(value); 
  }

  ngOnInit() {
  }

}
