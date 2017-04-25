import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators} from '@angular/forms';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
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
import { registerActionAsync } from '../../_redux/login/login_actions';
//access dom
import {ElementRef, ViewChild} from '@angular/core';

//custom from validator
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  //access dom
  //@ViewChild('photoUpload') el:ElementRef;

  registerForm: FormGroup;
  appName: string;
  isRegistered: boolean = false;

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
              private router: Router, private logAppStateService: LogAppStateService, private cValidators: CustomFormValidators, private http: Http){ 
    //formGroup
    this.registerForm = fb.group({
      'username': ['', Validators.compose([Validators.required, this.cValidators.usernameValidator()]), this.cValidators.usernameAsyncValidator()],
      'email': ['', Validators.compose([Validators.required, Validators.email]), this.cValidators.emailAsyncValidator()],
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
        console.log(this.file);
        this.photo_name = this.file.name;
        //check file size
        let size = this.file.size / 1024 / 1024
        if (parseInt(size.toFixed(2)) > 10) {
            this.photo_is2Large = true;
        }
        else{
          this.photo_is2Large = false;
        }
        //check image format
        if (this.file.type !== "image/png" && this.file.type  !== "image/jpeg" && this.file.type  !== "image/bmp" && this.file.type  !== "image/gif") {
            this.photo_isSupported =  false;
        }
        else{
          this.photo_isSupported =  true;
        }
  }
  
  onRegister(values: any): void{
    let obj = {
            username : values.username,
            email : values.email,
            password1 : values.password1,
            password2 : values.password2,
            first_name : values.first_name,
            last_name : values.last_name,
            //birth_date : '2017-05-01',
            birth_date : values.birth_date.date.year + '-'+ values.birth_date.date.month + '-'+ values.birth_date.date.day,
            telephone : values.telephone };
        //url for get auth user details
    const register_url: string  = this.appSetting.URL + this.appSetting.REGISTER_USER;
    //let headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    //let options = new RequestOptions({ headers: headers });
    console.log(obj);
    console.log(this.file);
    let formData: FormData = new FormData();
    formData.append("obj", JSON.stringify(obj));
    formData.append("file", this.file, this.file.name);
    /*
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.setRequestHeader('Content-Type', 'multipart/form-data')
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Cache-Control", "no-store");
    xhr.setRequestHeader("Pragma", "no-cache");
    xhr.open('POST', register_url, true);
    xhr.send(formData);
    */
    this.http.post(register_url, formData)
              .map(res => res.json())
              .catch(error => Observable.throw(error))
             .subscribe(data => {
                console.log('uploaded and processed files');
            },
            error => console.log(error),
            () => {});
    //this.appStore.dispatch(registerActionAsync(values, this.registerService, this.http, this.logAppStateService, this.alertService));

  }

  updateState(){ 
    let state= this.appStore.getState();
    if(state.authInfo){
       let isLogin = state.authInfo.token? true: false;
      if(isLogin){
      this.router.navigate(['home']);}
    } 
  }

  ngOnInit() {}
}
