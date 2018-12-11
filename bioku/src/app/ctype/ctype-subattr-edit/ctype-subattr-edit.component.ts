import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CType, CTypeAttr, CTypeSubAttr, CTypeSubAttrExt } from '../../_classes/CType';
import { CTypeService } from '../../_services/CTypeService';
import { AlertService } from '../../_services/AlertService';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';

@Component({
  selector: 'app-ctype-subattr-edit',
  templateUrl: './ctype-subattr-edit.component.html',
  styleUrls: ['./ctype-subattr-edit.component.css']
})
export class CtypeSubattrEditComponent implements OnInit, OnDestroy {
  ctype_pk: number;
  attr_pk: number;
  subattr_pk: number;
  private sub: any; // subscribe to params observable
  cSubAttr: CTypeSubAttr = new CTypeSubAttr();
  value_type: number;
  cAttrForm: FormGroup;
  allow_change = false;
  constructor(private ctypeService: CTypeService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any,
    private cValidators: CustomFormValidators, private fb: FormBuilder) {
    this.sub = this.route.parent.parent.params
    .switchMap(params => {
      this.ctype_pk = +params['pk'];
      return this.route.parent.params;
    })
    .subscribe(params => {
      this.attr_pk = +params['attr_pk'];
    })
      // formGroup
      this.cAttrForm = this.fb.group({
        // customized type
        'attr_name': [, Validators.compose([Validators.required, this.cValidators.ctypeAttrNameRegexValidator()]),
            this.cValidators.ctypeSubAttrNameAsyncValidator(this.ctype_pk, this.attr_pk, -1)],
        'attr_value_type': [this.value_type, Validators.required],
        'attr_value_text_max_length': [false, ],
        'attr_value_decimal_total_digit': [5, ],
        'attr_value_decimal_point': [2, ],
        'attr_required': [false, ]
        });
    }
  changeValueType(elm: any) {
    this.value_type = +(elm.target.value);
  }
  onUpdate(values: any) {
    const cSubAttr = new CTypeSubAttr();
    cSubAttr.pk = this.subattr_pk;
    cSubAttr.parent_attr_id = this.attr_pk;
    cSubAttr.attr_name = values.attr_name.toLowerCase().replace(' ', '_');
    cSubAttr.attr_order = this.cSubAttr.attr_order;
    cSubAttr.attr_label = values.attr_name.toUpperCase().replace(' ', '_');
    cSubAttr.attr_value_type = isNaN(+values.attr_value_type) ? 0 : +values.attr_value_type;
    cSubAttr.attr_value_text_max_length = values.attr_value_text_max_length ? 0 : 50;
    cSubAttr.attr_value_decimal_total_digit = isNaN(+values.attr_value_decimal_total_digit) || +values.attr_value_decimal_total_digit <= 0
    ? 5 : +values.attr_value_decimal_total_digit;
    cSubAttr.attr_value_decimal_point = isNaN(+values.attr_value_decimal_point) || +values.attr_value_decimal_point <= 0
    ? 2 : +values.attr_value_decimal_point;
    cSubAttr.attr_required = values.attr_required;
    this.ctypeService.updateCTypeSubAttr(cSubAttr, this.ctype_pk, this.attr_pk, this.subattr_pk)
    .subscribe(
      () => {
        this.alertService.success('THE TYPE SUBATTR MODIFIED!', true);
        this.router.navigate(['../ctypes', this.ctype_pk], { queryParams: { 'refresh': 'ADD_ATTR' } });
      },
      () => {
        this.alertService.error('SOMETHING WENT WRONG, FAILED TO MODIFY THE SUBATTR!', true);
        this.router.navigate(['../ctypes', this.ctype_pk, this.attr_pk]);
      });
  }
  ngOnInit() {
    this.sub = this.route.params
    .mergeMap((params) => {
      this.subattr_pk = +params['subattr_pk'];
      return this.ctypeService.getCTypeSubAttrDetail(this.ctype_pk, this.attr_pk, this.subattr_pk)
    })
    .subscribe(
      (cSubAttr: CTypeSubAttrExt) => {
        this.allow_change = +cSubAttr.data_count  === 0 ? true : false;
        this.cSubAttr = cSubAttr;
        this.value_type = this.cSubAttr.attr_value_type;
        this.cAttrForm = this.fb.group({
          // customized type
          'attr_name': [this.cSubAttr.attr_name, Validators.compose([Validators.required, this.cValidators.ctypeAttrNameRegexValidator()]),
              this.cValidators.ctypeSubAttrNameAsyncValidator(this.ctype_pk, this.attr_pk, this.cSubAttr.pk)],
          'attr_value_type': [this.value_type, Validators.required],
          'attr_value_text_max_length': [
            (this.cSubAttr.attr_value_text_max_length != null
            && this.cSubAttr.attr_value_text_max_length <= 50
            ) ? false : true , ],
          'attr_value_decimal_total_digit': [this.cSubAttr.attr_value_decimal_total_digit, ],
          'attr_value_decimal_point': [this.cSubAttr.attr_value_decimal_point, ],
          'attr_required': [this.cSubAttr.attr_required, ]
          });
      },
      () => {
        this.alertService.error('SOMETHING WENT WRONG, FAILED TO LOAD THE SUBATTR!', true);
        this.router.navigate(['../ctypes', this.ctype_pk, this.attr_pk]);
      });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
