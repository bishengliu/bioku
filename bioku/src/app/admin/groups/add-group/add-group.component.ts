import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Router} from '@angular/router';
import { AlertService } from '../../../_services/AlertService';
import { AppSetting} from '../../../_config/AppSetting';
import { APP_CONFIG } from '../../../_providers/AppSettingProvider';
import { LogAppStateService } from '../../../_services/LogAppStateService';
import { User } from '../../../_classes/User';
import {  GroupService } from '../../../_services/GroupService';
//mydatepicker
import {IMyOptions} from 'mydatepicker';

//redux
import { AppStore } from '../../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../../_redux/root/state';

//access dom
import {ElementRef, ViewChild} from '@angular/core';

//custom from validator
import { CustomFormValidators } from '../../../_helpers/CustomFormValidators';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {

  //access dom
  @ViewChild('photoName') photoInput:ElementRef;

  groupForm: FormGroup;
  //for photo upload
  file: File;
  photo_name: string;
  photo_is2Large: Boolean = false;
  photo_isSupported: Boolean = true;
  
  //auth user
  user: User = null;
  token: string = null;

  constructor(fb: FormBuilder, private alertService: AlertService, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private groupService: GroupService,
              private router: Router, private logAppStateService: LogAppStateService, private cValidators: CustomFormValidators, private http: Http) 
  { 
    //get the photo name for form
    let state= this.appStore.getState();
    this.user = state.authInfo.authUser;
    this.token = state.authInfo.token.token;

    //formGroup
    this.groupForm = fb.group({
      'group_name': [, Validators.compose([Validators.required, this.cValidators.humanNameValidator()]), this.cValidators.groupnameAsyncValidator(-1)],          
      'email': [, Validators.compose([Validators.required, Validators.email]), this.cValidators.groupemailAsyncValidator(-1)],
      'pi_fullname': [, Validators.compose([Validators.required, this.cValidators.humanNameValidator()])],
      'pi': [, Validators.compose([Validators.required, this.cValidators.humanNameValidator()])],
      'photo': ['', ],
      'telephone': [, this.cValidators.telephoneValidator()],
      'department': [, Validators.compose([this.cValidators.humanNameValidator(),])]
      });
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

  onCreate(values: any): void{
    console.log(this.groupForm);
    let obj = {
        group_name: values.group_name,            
        email: values.email,
        pi_fullname: values.pi_fullname,
        pi: values.pi.toUpperCase(),
        department: values.department,
        telephone : values.telephone 
        };
    console.log(obj);
    let formData: FormData = new FormData();
    formData.append("obj", JSON.stringify(obj));
    if (this.file){
      formData.append("file", this.file, this.file.name);
    }
    //post call
    this.groupService.create(formData)
    .subscribe(
      data=> this.alertService.success('New Group Added!', true),
      () => this.alertService.error('Something went wrong, the new group was not created!', true)
    );
    //naviagate to home
    this.router.navigate(['/admin']);    
  }

  ngOnInit() {
  }
}
