import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Router} from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { ResetPasswordService } from '../../_services/ResetPasswordService';

//custom from validator
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  forgetForm: FormGroup;
  constructor(fb: FormBuilder, private alertService: AlertService, @Inject(APP_CONFIG) private appSetting: any, 
              private router: Router, private cValidators: CustomFormValidators, private resetPasswordService: ResetPasswordService) 
  { 
    this.forgetForm = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.email]), this.cValidators.emailAsyncValidator(-1)],
    });
  }

  ngOnInit() {}
  onForget(values: any){
    let protocol = this.appSetting.APP_PROTOCOL;
    let site_name = this.appSetting.APP_SITE_NAME;
    let domain = this.appSetting.APP_DOMAIN;
    let default_from_email = this.appSetting.APP_DEFAULT_EMAIL;
    let obj = {
      email : values.email,
      domain: domain,
      site_name: site_name,
      protocol: protocol,
      default_from_email: default_from_email
    };
    this.resetPasswordService.resetPassword(obj)
    .subscribe(
      ()=>{
        this.alertService.success('Email has been sent to '+ obj.email +'\'s email address. Please check its inbox to continue reseting password.' ,true);
        this.router.navigate(['/login']);
      },
      (err)=>{console.log(err);}
    );
  }
}
