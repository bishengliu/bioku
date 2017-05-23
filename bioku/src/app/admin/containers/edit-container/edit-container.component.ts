import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../_services/AlertService';
import { AppSetting} from '../../../_config/AppSetting';
import { APP_CONFIG } from '../../../_providers/AppSettingProvider';
import { LogAppStateService } from '../../../_services/LogAppStateService';
import { User } from '../../../_classes/User';
import { Container } from '../../../_classes/Container';
import {  ContainerService } from '../../../_services/ContainerService';

//redux
import { AppStore } from '../../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../../_redux/root/state';
//access dom
import {ElementRef, ViewChild} from '@angular/core';

//custom from validator
import { CustomFormValidators } from '../../../_helpers/CustomFormValidators';

@Component({
  selector: 'app-edit-container',
  templateUrl: './edit-container.component.html',
  styleUrls: ['./edit-container.component.css']
})
export class EditContainerComponent implements OnInit, OnDestroy {
  //access dom
  @ViewChild('photoName') photoInput:ElementRef;
  //route param
  id: number;
  private sub: any; //subscribe to params observable

  containerForm: FormGroup;

  //for photo upload
  file: File;
  photo_name: string = '';
  photo_is2Large: Boolean = false;
  photo_isSupported: Boolean = true;

  //auth user
  user: User = null;
  token: string = null;
  container: Container = null;

  constructor(private fb: FormBuilder, private alertService: AlertService, private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, 
              private router: Router, private logAppStateService: LogAppStateService, private cValidators: CustomFormValidators, private containerService: ContainerService)
  {
    //get the photo name for form
    let state= this.appStore.getState();
    this.user = state.authInfo.authUser;
    this.token = state.authInfo.token.token;
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
      name: values.name,            
      temperature: values.temperature,
      room: values.room,
      tower: values.tower,
      shelf: values.shelf,
      box : values.box,
      description : values.description
    };
    //console.log(obj);
    let formData: FormData = new FormData();
    formData.append("obj", JSON.stringify(obj));
    if (this.file){
      formData.append("file", this.file, this.file.name);
    }
    //put call
    this.containerService.containerUpdate(formData, this.id)
    .subscribe(
      data=> this.alertService.success('Container Profile Updated!', true),
      () => this.alertService.error('Something went wrong, the container profile was not updated!', true)
    );
    //naviagate to home
    this.router.navigate(['/admin/containers']);  
  }

  ngOnInit() 
  {
    //init formGroup
    this.containerForm = this.fb.group({
      'name': [, Validators.compose([Validators.required, this.cValidators.humanNameValidator()]), this.cValidators.containernameAsyncValidator(-1)],          
      'temperature': [, Validators.required],
      'room': [, ],
      'photo': ['', ],
      'tower': [, Validators.compose([Validators.required, this.cValidators.digitValidator()])],
      'shelf': [, Validators.compose([Validators.required, this.cValidators.digitValidator()])],
      'box': [, Validators.compose([Validators.required, this.cValidators.digitValidator()])],
      'description': [, ]
    });

    this.sub = this.route.params
    .mergeMap((params) =>{
      this.id = +params['id'];
      return this.containerService.containerDetail(this.id);
    })
    .subscribe(
         data =>{
           this.container = data;
           //photo
           if(this.container.photo != null){
              let photo_path = this.container.photo;
              this.photo_name = photo_path ? photo_path.split('/').pop(): '';}
            //update the formGroup
              this.containerForm = this.fb.group({
                'name': [this.container.name, Validators.compose([Validators.required, this.cValidators.humanNameValidator()]), this.cValidators.containernameAsyncValidator(this.container.pk)],          
                'temperature': [this.container.temperature, Validators.required],
                'room': [this.container.room, ],
                'photo': ['', ],
                'tower': [+this.container.tower, Validators.compose([Validators.required, this.cValidators.digitValidator()])],
                'shelf': [+this.container.shelf, Validators.compose([Validators.required, this.cValidators.digitValidator()])],
                'box': [+this.container.box, Validators.compose([Validators.required, this.cValidators.digitValidator()])],
                'description': [this.container.description, ]
            }); 
          },
          () => this.alertService.error('Something went wrong, data were not loaded from the server!', true)
       );


    
  }
  ngOnDestroy() { this.sub.unsubscribe(); }

}
