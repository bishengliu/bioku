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
  constructor(private ctypeService: CTypeService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any,
    private cValidators: CustomFormValidators, private fb: FormBuilder) {
      this.sub = this.route.parent.params
    .subscribe((params) => {
      this.pk = +params['pk'];
    });
    this.cAttrForm = this.fb.group({});

    // formGroup
    this.cAttrForm = this.fb.group({
      // customized type
      'attr_name': [, Validators.compose([Validators.required, this.cValidators.ctypeAttrNameRegexValidator()])],
      'attr_value_type': [, Validators.required],
      'attr_value_text_max_length': [false, ],
      'attr_value_decimal_total_digit': [5, ],
      'attr_value_decimal_point': [2, ],
      'attr_required': [false, ]
      });
    }

  ngOnInit() {}
  onCreate(values: any) {
    console.log(values);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
