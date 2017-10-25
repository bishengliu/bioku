import { Component, OnInit, OnDestroy, Inject, AfterViewInit} from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../_services/AlertService';
import { GroupService } from '../../../_services/GroupService';
import { AppSetting} from '../../../_config/AppSetting';
import { APP_CONFIG } from '../../../_providers/AppSettingProvider';
import { LogAppStateService } from '../../../_services/LogAppStateService';
import { User } from '../../../_classes/User';
import { Group } from '../../../_classes/Group';

// redux
import { AppStore } from '../../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../../_redux/root/state';
// access dom
import {ElementRef, ViewChild} from '@angular/core';

// custom from validator
import { CustomFormValidators } from '../../../_helpers/CustomFormValidators';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css']
})
export class EditGroupComponent implements OnInit, OnDestroy, AfterViewInit {
  // access dom
  @ViewChild('photoName') photoInput: ElementRef;

  // route param
  id: number;
  private sub: any; // subscribe to params observable

  profileForm: FormGroup;
  // for photo upload
  file: File;
  photo_name: String = '';
  photo_is2Large: Boolean = false;
  photo_isSupported: Boolean = true;

  // auth user
  user: User = null;
  token: string = null;
  group: Group = null;

  constructor(private fb: FormBuilder, private alertService: AlertService, private route: ActivatedRoute,
              @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private router: Router,
              private logAppStateService: LogAppStateService, private cValidators: CustomFormValidators,
              private groupService: GroupService) {
    // get the photo name for form
    const state = this.appStore.getState();
    this.user = state.authInfo.authUser;
    this.token = state.authInfo.token.token;
  }

  ngAfterViewInit() {
    // update photo name to the template
    this.photoInput.nativeElement.value = this.photo_name;
  }

  // check upload photo
  validatePhotoUpload(event: EventTarget) {
    const eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    const target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    const files: FileList = target.files;
    this.file = files[0];
    // console.log(this.file);
    this.photo_name = this.file.name;
    // check file size
    const size = this.file.size / 1024 / 1024
    if (parseInt(size.toFixed(2), 10) > 10) {
        this.photo_is2Large = true;
    } else {
      this.photo_is2Large = false;
    }
    // check image format
    if (this.file.type !== 'image/png' && this.file.type  !== 'image/jpeg' &&
        this.file.type  !== 'image/bmp' && this.file.type  !== 'image/gif') {
        this.photo_isSupported =  false;
    } else {
      this.photo_isSupported =  true; }
  }

  onUpdate(values: any): void {
    // console.log(this.profileForm);
    const obj = {
            group_name: values.group_name,
            email: values.email,
            pi_fullname: values.pi_fullname,
            pi: values.pi.toUpperCase(),
            department: values.department,
            telephone : values.telephone
          };
    // console.log(obj);
    const formData: FormData = new FormData();
    formData.append('obj', JSON.stringify(obj));
    if (this.file) {
      formData.append('file', this.file, this.file.name);
    }
    // put call
    this.groupService.groupUpdate(formData, this.id)
    .subscribe(
      data => {
        this.alertService.success('Group Profile Updated!', true);
        // naviagate to home
        this.router.navigate(['/admin/groups']); },
      () => {
        this.alertService.error('Something went wrong, the group profile was not updated!', true);
        // naviagate to home
        this.router.navigate(['/admin/groups']); }
    );
  }
  ngOnInit() {
    this.sub = this.route.params
    .mergeMap((params) => {
      this.id = +params['id'];
      return this.groupService.groupDetail(this.id);
    })
    .subscribe(
         data => {
           this.group = data;
           // photo
           if (this.group.photo != null) {
              const photo_path = this.group.photo;
              this.photo_name = photo_path ? photo_path.split('/').pop() : ''; }

            // update the formGroup
              this.profileForm = this.fb.group({
                'group_name': [this.group.group_name, Validators.compose([Validators.required, this.cValidators.humanNameValidator()]),
                              this.cValidators.groupnameAsyncValidator(this.group.pk)],
                'email': [this.group.email, Validators.compose([Validators.required, Validators.email]),
                              this.cValidators.groupemailAsyncValidator(+this.group.pk)],
                'pi_fullname': [this.group.pi_fullname, Validators.compose([Validators.required, this.cValidators.humanNameValidator()])],
                'pi': [this.group.pi, Validators.compose([Validators.required, this.cValidators.humanNameValidator()])],
                'photo': ['', ],
                'telephone': [this.group.telephone, this.cValidators.telephoneValidator()],
                'department': [this.group.department, Validators.compose([this.cValidators.humanNameValidator(), ])]
            });
          },
          () => this.alertService.error('Something went wrong, data were not loaded from the server!', true)
       );

       // init the form group
    this.profileForm = this.fb.group({
          'group_name': [, Validators.compose([Validators.required, this.cValidators.humanNameValidator()]),
                        this.cValidators.groupnameAsyncValidator(-1)],
          'email': [, Validators.compose([Validators.required, Validators.email]), this.cValidators.groupemailAsyncValidator(-1)],
          'pi_fullname': [, Validators.compose([Validators.required, this.cValidators.humanNameValidator()])],
          'pi': [, Validators.compose([Validators.required, this.cValidators.humanNameValidator()])],
          'photo': ['', ],
          'telephone': [, this.cValidators.telephoneValidator()],
          'department': [, Validators.compose([this.cValidators.humanNameValidator(), ])]
    });
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

}
