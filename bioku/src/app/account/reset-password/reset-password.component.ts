import { Component,  OnInit, Inject, OnDestroy } from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import {  AlertService } from '../../_services/AlertService';
import { ResetPasswordService } from '../../_services/ResetPasswordService';
//custom from validator
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  //route param
  uid: string;
  token: string;
  private sub: any; //subscribe to params observable
  passwordForm: FormGroup;
  constructor(@Inject(APP_CONFIG) private appSetting: any, private router: Router, private route: ActivatedRoute, 
  private alertService: AlertService, fb: FormBuilder, private cValidators: CustomFormValidators, private resetPasswordService: ResetPasswordService) 
  { 
    //formGroup
    this.passwordForm = fb.group({
      'password1': ['', Validators.compose([Validators.required, this.cValidators.passwordValidator()])],
      'password2': ['', Validators.compose([Validators.required, this.cValidators.passwordValidator()])]
    }); 
  }

  ngOnInit() {
    this.sub = this.route.params
    .subscribe(params=>{
      this.uid = params['uid'];
      this.token = params['token'];
    },()=>{})
  }
  onSubmit(values: any): void {
    this.resetPasswordService.performResetPassword(this.uid, this.token, values.password1, values.password2)
    .subscribe(()=>{
      this.alertService.success('Your password has been reset, you can login with your new password' ,true);
      this.router.navigate(['/login']);
    }, 
    (err)=>{
      console.log(err);
      this.alertService.error('Something went wrong, failed to reset password. Please try again!', true)
    }
  );
  }
  ngOnDestroy() { this.sub.unsubscribe(); }
}
