import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { LogAppStateService } from '../../_services/LogAppStateService';
import { UpdateGroupProfileService } from '../../_services/UpdateGroupProfileService';
import { User } from '../../_classes/User';
import { Group } from '../../_classes/Group';

//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';
import { REDUX_CONSTANTS as C } from '../../_redux/root/constants';
import { updateGroupProfileActionAsync } from '../../_redux/account/account_actions';
//access dom
import {ElementRef, ViewChild} from '@angular/core';

//custom from validator
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit, OnDestroy {

//access dom
  @ViewChild('photoName') photoInput:ElementRef;

  //route param
  id: number;
  private sub: any; //subscribe to params observable

  profileForm: FormGroup;
  appName: string;
  //for photo upload
  file: File;
  photo_name: string;
  photo_is2Large: Boolean = false;
  photo_isSupported: Boolean = true;

  //auth user
  user: User = null;
  token: string = null;
  groups: Array<Group> = null;
  group: Group = null;



  constructor(private fb: FormBuilder, private alertService: AlertService, private route: ActivatedRoute, private updateGroupProfileService : UpdateGroupProfileService,
              @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, 
              private router: Router, private logAppStateService: LogAppStateService, private cValidators: CustomFormValidators, private http: Http) 
  { 
  //get the photo name for form
  let state= this.appStore.getState();
  this.user = state.authInfo.authUser;
  this.token = state.authInfo.token.token;
  this.groups = state.authInfo.authGroup;
    
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
      console.log(this.profileForm);
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
    //put call
    this.appStore.dispatch(updateGroupProfileActionAsync(formData, this.id, this.updateGroupProfileService, this.http, this.logAppStateService, this.alertService));
    //naviagate to home
    this.router.navigate(['/']);    
  }

  updateState(){
    let state= this.appStore.getState();
    this.user = state.authInfo.authUser;
    this.token = state.authInfo.token.token;
    this.groups = state.authInfo.authGroup;
    //console.log(state);
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = +params['id']; // (+) converts string 'id' to a number
       let that = this;
       // get the group
       let groupArray = this.groups.filter(function(d, i){
         return +d.pk === that.id;
       });
       this.group = groupArray[0] || null;
       //photo
       let photo_path = this.group.photo;
       this.photo_name = this.group.photo ? photo_path.split('/').pop(): '';

       //formGroup
        this.profileForm = this.fb.group({
          'group_name': [this.group.group_name, Validators.compose([Validators.required, this.cValidators.humanNameValidator()]), this.cValidators.groupnameAsyncValidator(this.group.pk)],          
          'email': [this.group.email, Validators.compose([Validators.required, Validators.email]), this.cValidators.groupemailAsyncValidator(+this.group.pk)],
          'pi_fullname': [this.group.pi_fullname, Validators.compose([Validators.required, this.cValidators.humanNameValidator()])],
          'pi': [this.group.pi, Validators.compose([Validators.required, this.cValidators.humanNameValidator()])],
          'photo': ['', ],
          'telephone': [this.group.telephone, this.cValidators.telephoneValidator()],
          'department': [this.group.department, Validators.compose([this.cValidators.humanNameValidator(),])]
      });
    });
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
