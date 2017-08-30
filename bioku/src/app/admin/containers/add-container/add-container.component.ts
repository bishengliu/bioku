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
import {  ContainerService } from '../../../_services/ContainerService';

//redux
import { AppStore } from '../../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../../_redux/root/state';

//access dom
import {ElementRef, ViewChild} from '@angular/core';

//custom from validator
import { CustomFormValidators } from '../../../_helpers/CustomFormValidators';

@Component({
  selector: 'app-add-container',
  templateUrl: './add-container.component.html',
  styleUrls: ['./add-container.component.css']
})
export class AddContainerComponent implements OnInit {
  //access dom
  @ViewChild('photoName') photoInput:ElementRef;

  containerForm: FormGroup;
  //for photo upload
  file: File;
  photo_name: string;
  photo_is2Large: Boolean = false;
  photo_isSupported: Boolean = true;
  
  //auth user
  user: User = null;
  token: string = null;
  //get current route url
  url: string ="";
  constructor(fb: FormBuilder, private alertService: AlertService, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private containerService: ContainerService,
              private router: Router, private logAppStateService: LogAppStateService, private cValidators: CustomFormValidators, private http: Http)
  {
    let state= this.appStore.getState();
    this.user = state.authInfo.authUser;
    this.token = state.authInfo.token.token;

    //formGroup
    this.containerForm = fb.group({
      'name': [, Validators.compose([Validators.required, this.cValidators.humanNameValidator()]), this.cValidators.containernameAsyncValidator(-1)],          
      'temperature': [, Validators.required],
      'room': [, ],
      'photo': ['', ],
      'tower': [, Validators.compose([Validators.required, this.cValidators.digitValidator()])],
      'shelf': [, Validators.compose([Validators.required, this.cValidators.digitValidator()])],
      'box': [, Validators.compose([Validators.required, this.cValidators.digitValidator()])],
      'description': [, ]
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
    let obj = {
      name: values.name,            
      temperature: values.temperature,
      room: values.room,
      tower: values.tower,
      shelf: values.shelf,
      box : values.box,
      description : values.description
    };
    let formData: FormData = new FormData();
    formData.append("obj", JSON.stringify(obj));
    if (this.file){
      formData.append("file", this.file, this.file.name);
    }
    //post call
    this.containerService.create(formData)
    .subscribe(
      data=> {this.alertService.success('New Container Added!', true)},
      () => this.alertService.error('Something went wrong, the new container was not created!', true)
    );
    //naviagate to home
    if(this.url==="/containers/add"){
      this.router.navigate(['/containers']);}
    else{
      this.router.navigate(['/admin/containers']);}    
  }
  ngOnInit() {
    this.url = this.router.url;
  }

}
