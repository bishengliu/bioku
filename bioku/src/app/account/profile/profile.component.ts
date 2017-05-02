import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  //access dom
  @ViewChild('photoName') photoInput:ElementRef;

  profileForm: FormGroup;
  appName: string;
  //for photo upload
  file: File;
  photo_name: string;
  photo_is2Large: Boolean = false;
  photo_isSupported: Boolean = true;
  
  //auth user
  user: User = null;

  //mydatepicker
  private myDatePickerOptions: IMyOptions = {
        // other options...
        todayBtnTxt: 'Today',
        dateFormat: 'dd/mm/yyyy',
        openSelectorTopOfInput: true,
        showSelectorArrow: false,
        editableDateField: false,
        openSelectorOnInputClick: true};

  constructor(fb: FormBuilder, private alertService: AlertService, 
              @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private registerService: RegisterService,
              private router: Router, private logAppStateService: LogAppStateService, private cValidators: CustomFormValidators, private http: Http) {
  //get the photo name for form
  let state= this.appStore.getState();
  this.user = state.authInfo.authUser;
  let photo_path = this.user.profile.photo;
  this.photo_name = this.user.profile.photo ? photo_path.split('/').pop(): '';
  //parse date for form intial birth date
  let init_date = {};
  if(this.user.profile.birth_date){
    let dArray = this.user.profile.birth_date.split('-');
    init_date = {date: {year: +dArray[0], month: +dArray[1], day: +dArray[2]}};
  }
  //formGroup
    this.profileForm = fb.group({
      'email': [this.user.email, Validators.compose([Validators.required, Validators.email]), this.cValidators.emailAsyncValidator(+this.user.pk)],
      'first_name': [this.user.first_name, Validators.compose([Validators.required, this.cValidators.humanNameValidator()])],
      'last_name': [this.user.last_name, Validators.compose([Validators.required, this.cValidators.humanNameValidator()])],
      'birth_date': [init_date, ],
      'photo': ['', ],
      'telephone': [this.user.profile.telephone, this.cValidators.telephoneValidator()]
    });
    //app name
    this.appName = appSetting.NAME;
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();
    
  }

  ngAfterViewInit() {
    //update photo name to the template
    this.photoInput.nativeElement.value = this.photo_name;
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
  
    onUpdate(values: any): void{
    let obj = {
            email: values.email,
            first_name : values.first_name,
            last_name : values.last_name,
            birth_date : values.birth_date.date.year + '-'+ values.birth_date.date.month + '-'+ values.birth_date.date.day,
            telephone : values.telephone };
        //url for get auth user details
    const update_profile_url: string  = this.appSetting.URL + this.appSetting.UPDATE_USER_PROFILE+this.user.pk+'/';
    let formData: FormData = new FormData();
    formData.append("obj", JSON.stringify(obj));
    if (this.file){
      formData.append("file", this.file, this.file.name);
    }
    //put call
    ///////////////////////////////////////////////
    //naviagate to home
    this.router.navigate(['/']);    
  }

  updateState(){
    let state= this.appStore.getState();
    this.user = state.authInfo.authUser;
    //console.log(state);
  }

  ngOnInit() {}

}
