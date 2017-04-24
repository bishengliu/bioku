import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators} from '@angular/forms';
import { Http } from '@angular/http';
import { Router} from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { LoginService } from '../../_services/LoginService';
import { RegisterService } from '../../_services/RegisterService';
import { LogAppStateService } from '../../_services/LogAppStateService';
import { User } from '../../_classes/User';
//mydatepicker
import {IMyOptions} from 'mydatepicker';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';
import { REDUX_CONSTANTS as C } from '../../_redux/root/constants';
//REDUX

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
  //for photo upload
  file: File;
  photo_name: string;
  photo_is2Large: Boolean = false;
  photo_isSupported: Boolean = true;

  //mydatepicker
  private myDatePickerOptions: IMyOptions = {
        // other options...
        dateFormat: 'dd/mm/yyyy',
        openSelectorTopOfInput: true,
        showSelectorArrow: false,
        editableDateField: false,
        openSelectorOnInputClick: true};

  constructor(fb: FormBuilder, private alertService: AlertService, 
              @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private registerService: RegisterService,
              private router: Router, private logAppStateService: LogAppStateService, private cValidators: CustomFormValidators){ 
    //validator patterns
    this.registerForm = fb.group({
      'username': ['', Validators.compose([Validators.required, this.cValidators.usernameValidator(), this.cValidators.usernameAsyncValidator()])],
      'email': ['', Validators.compose([Validators.required, Validators.email, , this.cValidators.emailAsyncValidator()])],
      'password1': ['', Validators.compose([Validators.required, this.cValidators.passwordValidator()])],
      'password2': ['', Validators.compose([Validators.required, this.cValidators.passwordValidator()])],
      'first_name': ['', Validators.compose([Validators.required, this.cValidators.humanNameValidator()])],
      'last_name': ['', Validators.compose([Validators.required, this.cValidators.humanNameValidator()])],
      'birth_date': ['', ],
      'photo': ['', ],
      'telephone': ['', this.cValidators.telephoneValidator()]});
    
    //app name
    this.appName = appSetting.NAME;
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();
  }

  //my datepicker
  setDate(): void {
        // Set today date using the setValue function
        let date = new Date();
        this.registerForm.setValue({birth_date: {
        date: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()}
        }});
  }

  clearDate(): void {
        // Clear the date using the setValue function
        this.registerForm.setValue({birth_date: ''});
  }

  //check upload photo
  validatePhotoUpload(event: EventTarget) {
        let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        this.file = files[0];
        //console.log(this.file);
        this.photo_name = this.file.name;
        //check file size
        let size = this.file.size / 1024 / 1024
        if (parseInt(size.toFixed(2)) > 10) {
            this.photo_is2Large = true;
        }
        //check image format
        if (this.file.type !== "image/png" && this.file.type  !== "image/jpeg" && this.file.type  !== "image/bmp" && this.file.type  !== "image/gif") {
            this.photo_isSupported =  false;
        }
  }


  onRegister(values: any): void{
      //console.log(this.registerForm);
      //console.log(values);
      this.registerService.registerUser(values).subscribe(
          (data)=>{
            console.log(data);
            if(data.detail){
              this.isRegistered = true;
              //loger redux
              //get state: apppartialstate
              let preState: AppPartialState = this.logAppStateService.getAppPartialState();
              //get state: apppartialstate
              let nextState: AppPartialState = this.logAppStateService.getAppPartialState();
              let message: string = 'the new user registered!'
              //logger the redux action
              this.logAppStateService.log('REGISTER USER', preState, nextState, message);

              this.router.navigate(['login']);
            }
          },
      ()=>{ this.isRegistered = false;},
      ()=>{});
  }

  updateState(){ let state= this.appStore.getState();}

  ngOnInit() {}
}
