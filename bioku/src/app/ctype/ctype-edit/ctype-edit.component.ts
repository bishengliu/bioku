import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CType, CTypeAttr, CTypeSubAttr } from '../../_classes/CType';
import { CTypeService } from '../../_services/CTypeService';
import { AlertService } from '../../_services/AlertService';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';

@Component({
  selector: 'app-ctype-edit',
  templateUrl: './ctype-edit.component.html',
  styleUrls: ['./ctype-edit.component.css']
})
export class CtypeEditComponent implements OnInit, OnDestroy {
  pk: number;
  private sub: any; // subscribe to params observable
  ctypeForm: FormGroup;
  ctype: CType = new CType();
  constructor(private ctypeService: CTypeService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any,
    private cValidators: CustomFormValidators, private fb: FormBuilder) {
    this.sub = this.route.parent.params
    .subscribe((params) => {
      this.pk = +params['pk'];
    })
    // formGroup
    this.ctypeForm = fb.group({
      // customized type
      'type': [, Validators.compose([Validators.required, this.cValidators.ctypeNameRegexValidator()]),
      this.cValidators.ctypeNameAsyncValidator(-1, -1)],
      'description': [, ]
    });
  }
  onUpdate(values: any) {
    const ctype: CType = new CType();
    ctype.pk = this.ctype.pk;
     ctype.type = values.type.toUpperCase();
     ctype.group_id = this.ctype.group_id;
     ctype.is_public = this.ctype.is_public;
     ctype.description = values.description;
     this.ctypeService.updateCType(ctype, this.pk).subscribe(
      () => {
        this.alertService.success('THE TYPE MODIFUED!', true);
        this.router.navigate(['../ctypes', this.pk], { queryParams: { 'refresh': true } });
      },
      () => {
        this.alertService.error('SOMETHING WENT WRONG, FAILED TO MODIFY THE TYPE!', true);
        this.router.navigate(['../ctypes', this.pk]);
      }
     );
  }
  ngOnInit() {
    // console.log(this.pk);
    this.ctypeService.getCTypeDetail(this.pk).subscribe(
      (ctype: CType) => {
        this.ctype = ctype;
        // update fb
        this.ctypeForm = this.fb.group({
          // customized type
          'type': [this.ctype.type, Validators.compose([Validators.required, this.cValidators.ctypeNameRegexValidator()]),
          this.cValidators.ctypeNameAsyncValidator(this.ctype.group_id, this.ctype.pk)],
          'description': [ (this.ctype.description === 'None' || this.ctype.description === null ) ? '' : this.ctype.description, ]
        });
      },
      () => {
        this.alertService.error('SOMETHING WENT WRONG, FAILED TO LOAD THE TYPE!', true);
        this.router.navigate(['../ctypes', this.pk]);
      }
    );
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
