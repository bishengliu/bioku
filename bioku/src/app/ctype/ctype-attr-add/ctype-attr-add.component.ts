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
  selector: 'app-ctype-attr-add',
  templateUrl: './ctype-attr-add.component.html',
  styleUrls: ['./ctype-attr-add.component.css']
})
export class CtypeAttrAddComponent implements OnInit, OnDestroy {
  pk: number;
  private sub: any; // subscribe to params observable
  cAttrForm: FormGroup;
  ctype: CType = new CType();
  cAttr: CTypeAttr = new CTypeAttr();
  value_type: number;
  constructor(private ctypeService: CTypeService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any,
    private cValidators: CustomFormValidators, private fb: FormBuilder) {
      this.sub = this.route.parent.params
    .subscribe((params) => {
      this.pk = +params['pk'];
    });
    this.cAttrForm = this.fb.group({});
    this.value_type = 0;
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
  ngOnInit() {}
  onCreate(values: any) {
    const cAttr = new CTypeAttr();
    cAttr.ctype_id = this.pk;
    cAttr.attr_name = values.attr_name.toLowerCase().replace(' ', '_');
    cAttr.attr_order = 0;
    cAttr.attr_label = values.attr_name;
    cAttr.attr_value_type = isNaN(+values.attr_value_type) ? 0 : +values.attr_value_type;
    cAttr.attr_value_text_max_length = values.attr_value_text_max_length ? 0 : 50;
    cAttr.attr_value_decimal_total_digit = isNaN(+values.attr_value_decimal_total_digit) || +values.attr_value_decimal_total_digit <= 0
    ? 5 : +values.attr_value_decimal_total_digit;
    cAttr.attr_value_decimal_point = isNaN(+values.attr_value_decimal_point) || +values.attr_value_decimal_point <= 0
    ? 2 : +values.attr_value_decimal_point;
    cAttr.attr_required = values.attr_required;
    cAttr.has_sub_attr = !isNaN(+values.attr_value_type) && +values.attr_value_type === 3 ? true : false;
    this.ctypeService.addCTypeAttr(cAttr, this.pk)
    .subscribe(
      () => {
        this.alertService.success('THE TYPE ATTR ADDED!', true);
        this.router.navigate(['../ctypes', this.pk], { queryParams: { 'refresh': 'ADD_ATTR' } });
      },
      () => {
        this.alertService.error('SOMETHING WENT WRONG, FAILED TO ADD THE TYPE ATTR!', true);
        this.router.navigate(['../ctypes', this.pk]);
      }
    );
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
