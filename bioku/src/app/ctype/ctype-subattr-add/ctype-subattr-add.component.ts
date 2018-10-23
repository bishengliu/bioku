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
  selector: 'app-ctype-subattr-add',
  templateUrl: './ctype-subattr-add.component.html',
  styleUrls: ['./ctype-subattr-add.component.css']
})
export class CtypeSubattrAddComponent implements OnInit, OnDestroy {
  pk: number;
  attr_pk: number;
  private sub: any; // subscribe to params observable
  cAttrForm: FormGroup;
  cAttr: CTypeAttr = new CTypeAttr();
  value_type: number;
  constructor(private ctypeService: CTypeService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any,
    private cValidators: CustomFormValidators, private fb: FormBuilder) {
      this.value_type = 0;
      this.sub = this.route.parent.parent.params
      .mergeMap((params) => {
        this.pk = +params['pk'];
        return this.route.parent.params
      })
      .mergeMap((params) => {
        this.attr_pk = +params['attr_pk'];
        return this.ctypeService.getCTypeAttrDetail(this.pk, this.attr_pk);
      })
      .subscribe(
        (cAttr: CTypeAttr) => {
          this.cAttr = cAttr;
        },
        () => {
          this.alertService.error('SOMETHING WENT WRONG, FAILED TO LOAD THE ATTR!', true);
          this.router.navigate(['../ctypes', this.pk, this.attr_pk]);
        }
      );
      // formGroup
      this.cAttrForm = this.fb.group({
        // customized type
        'attr_name': [, Validators.compose([Validators.required, this.cValidators.ctypeAttrNameRegexValidator()]),
                                                  this.cValidators.ctypeSubAttrNameAsyncValidator(this.pk, this.attr_pk, -1)],
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
  onCreate(values: any) {
    const cSubAttr = new CTypeSubAttr();
    cSubAttr.parent_attr_id = this.attr_pk;
    cSubAttr.attr_name = values.attr_name.toLowerCase().replace(' ', '_');
    cSubAttr.attr_order = 0;
    cSubAttr.attr_label = values.attr_name.toUpperCase().replace(' ', '_');
    cSubAttr.attr_value_type = isNaN(+values.attr_value_type) ? 0 : +values.attr_value_type;
    cSubAttr.attr_value_text_max_length = values.attr_value_text_max_length ? 0 : 50;
    cSubAttr.attr_value_decimal_total_digit = isNaN(+values.attr_value_decimal_total_digit) || +values.attr_value_decimal_total_digit <= 0
    ? 5 : +values.attr_value_decimal_total_digit;
    cSubAttr.attr_value_decimal_point = isNaN(+values.attr_value_decimal_point) || +values.attr_value_decimal_point <= 0
    ? 2 : +values.attr_value_decimal_point;
    cSubAttr.attr_required = values.attr_required;
    console.log(cSubAttr);
    this.ctypeService.addCTypeSubAttr(cSubAttr, this.pk, this.attr_pk)
    .subscribe(
      () => {
        this.alertService.success('THE TYPE SUBATTR ADDED!', true);
        this.router.navigate(['../ctypes', this.pk], { queryParams: { 'refresh': 'ADD_ATTR' } });
      },
      () => {
        this.alertService.error('SOMETHING WENT WRONG, FAILED TO ADD THE SUBATTR!', true);
        this.router.navigate(['../ctypes', this.pk, this.attr_pk]);
      }
    );
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
