import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CType, CTypeAttr, CTypeSubAttr, CTypeAttrExt } from '../../_classes/CType';
import { CTypeService } from '../../_services/CTypeService';
import { AlertService } from '../../_services/AlertService';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';

@Component({
  selector: 'app-ctype-attr-edit',
  templateUrl: './ctype-attr-edit.component.html',
  styleUrls: ['./ctype-attr-edit.component.css']
})
export class CtypeAttrEditComponent implements OnInit, OnDestroy {
  pk: number;
  attr_pk: number;
  private sub: any; // subscribe to params observable
  cAttrForm: FormGroup;
  cAttr: CTypeAttr = new CTypeAttr();
  value_type: number;
  allow_change = false;
  constructor(private ctypeService: CTypeService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any,
    private cValidators: CustomFormValidators, private fb: FormBuilder) {
      this.sub = this.route.parent.params
      .subscribe((params) => {
        this.pk = +params['pk'];
      });
    // formGroup
    this.cAttrForm = this.fb.group({
      // customized type
      'attr_name': [, Validators.compose([Validators.required, this.cValidators.ctypeAttrNameRegexValidator()]),
                                                this.cValidators.ctypeAttrNameAsyncValidator(this.pk, -1)],
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
    const cAttr = new CTypeAttr();
    cAttr.pk = this.attr_pk;
    cAttr.ctype_id = this.pk;
    cAttr.attr_name = values.attr_name.toLowerCase().replace(' ', '_');
    cAttr.attr_order = this.cAttr.attr_order;
    cAttr.attr_label = values.attr_name.toUpperCase().replace(' ', '_');
    cAttr.attr_value_type = isNaN(+values.attr_value_type) ? 0 : +values.attr_value_type;
    cAttr.attr_value_text_max_length = values.attr_value_text_max_length ? 0 : 50;
    cAttr.attr_value_decimal_total_digit = isNaN(+values.attr_value_decimal_total_digit) || +values.attr_value_decimal_total_digit <= 0
    ? 5 : +values.attr_value_decimal_total_digit;
    cAttr.attr_value_decimal_point = isNaN(+values.attr_value_decimal_point) || +values.attr_value_decimal_point <= 0
    ? 2 : +values.attr_value_decimal_point;
    cAttr.attr_required = values.attr_required;
    cAttr.has_sub_attr = !isNaN(+values.attr_value_type) && +values.attr_value_type === 3 ? true : false;
    this.ctypeService.updateCTypeAttr(cAttr, this.pk, this.attr_pk)
    .subscribe(
      () => {
        this.alertService.success('THE TYPE ATTR MODIFIED!', true);
        this.router.navigate(['../ctypes', this.pk], { queryParams: { 'refresh': 'UPDATE_ATTR' } });
      },
      () => {
        this.alertService.error('SOMETHING WENT WRONG, FAILED TO MODIFY THE TYPE ATTR!', true);
        this.router.navigate(['../ctypes', this.pk]);
      }
    );
  }
  ngOnInit() {
    this.sub = this.route.params
    .mergeMap((params) => {
      this.attr_pk = +params['attr_pk'];
      return this.ctypeService.getCTypeAttrDetail(this.pk, this.attr_pk)
    })
    .subscribe(
      (cAttr: CTypeAttrExt) => {
        this.cAttr = cAttr;
        this.value_type = this.cAttr.attr_value_type;
        this.allow_change = +cAttr.data_count  === 0 ? true : false;
        // formGroup
      this.cAttrForm = this.fb.group({
        // customized type
        'attr_name': [this.cAttr.attr_name, Validators.compose([Validators.required, this.cValidators.ctypeAttrNameRegexValidator()]),
                                                  this.cValidators.ctypeAttrNameAsyncValidator(this.pk, this.cAttr.pk)],
        'attr_value_type': [this.value_type, Validators.required],
        'attr_value_text_max_length': [
          (this.cAttr.attr_value_text_max_length != null
          && this.cAttr.attr_value_text_max_length <= 50
          ) ? false : true , ],
        'attr_value_decimal_total_digit': [this.cAttr.attr_value_decimal_total_digit, ],
        'attr_value_decimal_point': [this.cAttr.attr_value_decimal_point, ],
        'attr_required': [this.cAttr.attr_required, ]
        });
       },
      () => {
        this.alertService.error('SOMETHING WENT WRONG, FAILED TO LOAD THE ATTR!', true);
        this.router.navigate(['../ctypes', this.pk]);
      }
      )
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
