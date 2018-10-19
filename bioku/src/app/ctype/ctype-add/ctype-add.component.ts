import { Component, OnInit, Inject, Input, Output, EventEmitter, SimpleChanges, OnChanges} from '@angular/core';
import { Router} from '@angular/router';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';
import { CType, CTypeAttr, CTypeSubAttr } from '../../_classes/CType';
import { CTypeService } from '../../_services/CTypeService';
import { AlertService } from '../../_services/AlertService';
import { AppStore } from '../../_providers/ReduxProviders';
@Component({
  selector: 'app-ctype-add',
  templateUrl: './ctype-add.component.html',
  styleUrls: ['./ctype-add.component.css']
})
export class CtypeAddComponent implements OnInit {
  ctypeForm: FormGroup;
  group_id: number;
  constructor(private router: Router, @Inject(APP_CONFIG) private appSetting: any,
              private cValidators: CustomFormValidators, private fb: FormBuilder, @Inject(AppStore) private appStore,
              private ctypeService: CTypeService, private alertService: AlertService) {
    const state = this.appStore.getState();
    if (state.authInfo != null && state.authInfo.authGroup != null) {
      this.group_id = state.authInfo.authGroup[0].pk;
    }

    // formGroup
    this.ctypeForm = fb.group({
      // customized type
      'type': [ , Validators.compose([Validators.required, this.cValidators.ctypeNameRegexValidator]),
                                                          this.cValidators.ctypeNameAsyncValidator(this.group_id)],
      'description': [, ]
      });
   }
   onCreate(values: any) {
     const ctype: CType = new CType();
     ctype.type = values.type;
     ctype.group_id = this.group_id;
     ctype.is_public = false;
     ctype.description = values.description;
    this.ctypeService.addCType(ctype).subscribe(
      () => {
        this.alertService.success('NEW TYPE ADDED!', true);
        this.router.navigate(['../ctypes/']);
      },
      () => {
        this.alertService.error('SOMETHING WENT WRONG, THE NEW TYPE NOT ADDED!', true);
        this.router.navigate(['../ctypes/']);
      }
    );
   }

  ngOnInit() {
    // this.router.navigate(['../ctypes/']);
  }

}
