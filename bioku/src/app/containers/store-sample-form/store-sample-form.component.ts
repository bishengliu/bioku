import { Component, OnInit, OnChanges, Inject, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting } from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType, CSubAttrData, CTypeSubAttr } from '../../_classes/CType';
import { Container } from '../../_classes/Container';
import { ContainerService } from '../../_services/ContainerService';
import { AlertService } from '../../_services/AlertService';
import { LocalStorageService } from '../../_services/LocalStorageService';
import { CTypeService } from '../../_services/CTypeService';
import { UtilityService } from '../../_services/UtilityService';
// custom from validator
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';
// mydatepicker
import {IMyOptions} from 'mydatepicker';
// color picker
import { IColorPickerConfiguration } from 'ng2-color-picker';
@Component({
  selector: 'app-store-sample-form',
  templateUrl: './store-sample-form.component.html',
  styleUrls: ['./store-sample-form.component.css']
})
export class StoreSampleFormComponent implements OnInit, OnChanges {
  @Input() cells: string;
  slots: Array<string> = new Array<string>();
  @Input() container: Container;
  @Input() box: Box;
  appUrl: string;
  // upload
  file: File;
  attchment_name: string;
  attchament_is2large: Boolean = false;
  // for attchment upload
  @ViewChild('attachmentLabel') attachmentLabelInput: ElementRef;
  @ViewChild('attachmentDescription') attachmentDescriptionInput: ElementRef;
  // SAPMPLE TYPE
  sample_type = '-';
  // ALL SAMPLE TYPES
  all_sample_types: Array<String> = new Array<String>();
  freezing_date: string = null;
  storage_date: string = null;
  date_attrs = {};
  color = '#000000';
  // mydatepicker
  myDatePickerOptions: IMyOptions = {
      // other options...
      todayBtnTxt: 'Today',
      dateFormat: 'yyyy-mm-dd',
      openSelectorTopOfInput: true,
      showSelectorArrow: false,
      editableDateField: false,
      openSelectorOnInputClick: true};
  // color picker
  availableColors: Array<string> = [];
  pickerOptions: IColorPickerConfiguration = {
    width: 12,
    height: 12,
    borderRadius: 2};
  // form group
  form_valid: Boolean = true;
  sampleForm: FormGroup;
  saving: Boolean = false;
  // CUSTOM SAMPEL CODE NAME
  custom_sample_code_name = 'sample code';
  // use casmple
  USE_CSAMPLE = true;
  // all the ctypes
  all_ctypes: Array<CType> = new Array<CType>();
  ctype: CType = new CType();
  // loading falied
  failed = false;
  fb_group_controlsConfig = {};
  minimal_attrs: Array<string> = ['ctype', 'name', 'color', 'storage_date', 'attachment']
  extra_attrs: Array<any> = new Array<any>();
  // for the main type attr
  left_extra_attrs: Array<any> = new Array<any> ();
  right_extra_attrs: Array<any> = new Array<any> ();
  // for the subattr
  sub_table_attrs: Array<any> = new Array<any> ();
  has_subattr = false;
  // add or remove function
  subattr_handler = {};
  date_regex = 'DD-MM-YYYY';
  private customized_attrs: Array<any> = new Array<any> ();
  constructor(@Inject(APP_CONFIG) private appSetting: any, private containerService: ContainerService, private ctypeService: CTypeService,
              private cValidators: CustomFormValidators, private alertService: AlertService, private router: Router,
              private utilityService: UtilityService, private route: ActivatedRoute,
              private fb: FormBuilder, private localStorageService: LocalStorageService) {
    this.appUrl = this.appSetting.URL;
    this.availableColors = this.appSetting.APP_COLORS;
    this.custom_sample_code_name = this.appSetting.CUSTOM_SAMPLE_CODE_NAME.toLowerCase();
    this.sample_type = '-';
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
    this.failed = false;
    this.customized_attrs = this.appSetting.CUSTOMIZED_ATTRS;
    this.date_regex = this.appSetting.DATE_REGEX;
    // get all sample ctypes
    if (this.USE_CSAMPLE) {
      this.ctypeService.getCTypes()
      .subscribe((ctypes: Array<CType>) => {
        this.all_ctypes = ctypes;
        // console.log(this.all_ctypes);
        this.all_sample_types = this.all_ctypes.map((ctype: CType) => ctype.type);
      },
      () => {
        this.failed = true;
        this.alertService.error('failed to retrieve sample types, please refresh the page or contact the support!', false);
      });
    } else {
      this.all_sample_types = this.appSetting.SAMPLE_TYPE;
    }

    this.fb_group_controlsConfig = {
      'ctype': [, Validators.required],
      'name': [, Validators.required],
      'color': [, ],
      'storage_date': [, ],
      'attachment': [, ]
    }
    // get the minmal extra for csample
    const minimal_attrs = this.minimal_attrs;
    this.extra_attrs = this.getMinimalLabels(minimal_attrs);
    this.sampleForm = this.USE_CSAMPLE
    ? this.fb.group(this.fb_group_controlsConfig)
    : this.sampleForm = this.fb.group({
      // general
      'color': [, ],
      'type': [, Validators.required],
      'name': [, Validators.required],
      'official_name': [, ],
      'tag': [, ],
      'registration_code': [, ],
      'reference_code': [, ],
      'quantity': [, ],
      'quantity_unit': [, ],
      'freezing_code': [, ],
      'freezing_date': [, ],
      'description': [, ],
      'attachment_label': [, ],
      'attachment_description': [, ],
      // construct
      'clone_number': [, ],
      'against_260_280': [, ],
      'feature': [, ],
      'r_e_analysis': [, ],
      'backbone': [, ],
      'insert': [, ],
      'first_max': [, ],
      'marker': [, ],
      'has_glycerol_stock': [, ],
      'strain': [, ],
      // cell
      'passage_number': [, ],
      'cell_amount': [, ],
      'project': [, ],
      'creator': [, ],
      // oligo
      'oligo_name': [, ],
      's_or_as': [, ],
      'oligo_sequence': [, ],
      'oligo_length': [, ],
      'oligo_GC': [, ],
      'target_sequence': [, ],
      // virus
      'plasmid': [, ],
      'titration_titer': [, ],
      'titration_unit': [, ],
      'titration_cell_type': [, ],
      'titration_code': [, ],
      // tissue
      'pathology_code': [, ],
      'tissue': [, ]
      });
  }
  ngOnInit() {}

  ngOnChanges() {
    // positions
    this.slots = [];
    if (this.cells != null && this.cells !== '') {
      this.slots = this.cells.split(',');
    }
  }

  updateType(value: any) {
    this.sample_type = value.target.value;
    // reset form group for csample
    if (this.USE_CSAMPLE) {
      // empty the form
      this.extra_attrs = [];
      this.left_extra_attrs = [];
      this.right_extra_attrs = [];
      //
      this.has_subattr = false;
      // get the selected ctype
      const ctypes: Array<CType> = this.ctypeService.getCTypesByNames([this.sample_type], this.all_ctypes);
      this.ctype = ctypes[0];
      // FIND EXTRA SAMPLE ATTRS
      // this.extra_attrs = this.getExtraAttrs(this.sample_type, this.all_ctypes);
      // get current form values
      const fb_values = this.sampleForm.value;
      // update fromgroup
      this.sampleForm = this.updateFormGroup(this.fb, fb_values, this.ctype, this.fb_group_controlsConfig);
      // get sub_table_attrs
      if (this.has_subattr) {
        this.sub_table_attrs = this.genSubTableAttrs(this.extra_attrs);
      }
      // gen and bind subattr add and remove function
      this.subattr_handler = this.genSubAttrHandlers(this.sampleForm, this.ctype);
      // split the extra_attrs for display
      [this.left_extra_attrs, this.right_extra_attrs] = this.updateLeftRightExtraAttrs(this.extra_attrs);
    }
  }
  // render form label
  renderFormLabel(name: string, check_customized_attrs = false) {
    if (check_customized_attrs) {
      const matched = this.customized_attrs
      .find((a: any) => {return a.name === name });
      if (matched !== undefined) {
        return matched.label;
      } else {
        return name.toUpperCase();
      }
    } else {
      const matched = this.extra_attrs
      .find((a: any) => {return a.name === name });
      if (matched !== undefined) {
        return matched.label;
      } else {
        return name.toUpperCase();
      }
    }
  }
  renderFormSubTableLabel(attr_name: string, subattr_name: string, check_customized_attrs = false) {
    if (check_customized_attrs) {
      const pmatched = this.customized_attrs
      .find((a: any) => {return a.name === attr_name });
      if (pmatched !== undefined) {
        // find the sub
        const smatched = pmatched.subattrs
        .find((a: any) => {return a.name === subattr_name });
        if (smatched !== undefined) {
          return smatched.label;
        } else {
          return subattr_name.toUpperCase();
        }
      } else {
        return subattr_name.toUpperCase();
      }
    } else {
      const pmatched = this.extra_attrs
      .find((a: any) => {return a.name === attr_name });
      if (pmatched !== undefined) {
        // find the sub
        const smatched = pmatched.subattrs
        .find((a: any) => {return a.name === subattr_name });
        if (smatched !== undefined) {
          return smatched.label;
        } else {
          return subattr_name.toUpperCase();
        }
      } else {
        return subattr_name.toUpperCase();
      }
    }
  }
  // get the sub_table_attrs
  genSubTableAttrs(extra_attrs: Array<any>): Array<any> {
    return extra_attrs.filter((ex: any) => {
      return typeof ex.subattrs === 'object' && ex.subattrs.length > 0;
    })
  }
  // update left and right extra attrs
  updateLeftRightExtraAttrs(extra_attrs: Array<any>) {
    const left_extra_attrs: Array<any> = new Array<any>();
    const right_extra_attrs: Array<any> = new Array<any>();
    // remove the minimal attrs and attr with sub
    const minimal_attrs = this.minimal_attrs;
    const new_extra_attrs: Array<any> = extra_attrs.filter((attr: any) => {
      return minimal_attrs.indexOf(attr.name) === -1 && typeof attr.subattrs !== 'object';
    })
    const len = new_extra_attrs.length;
    if (len > 0) {
      if (len === 1 ) {
        left_extra_attrs.push(new_extra_attrs[0])
      } else if ( len === 2) {
        left_extra_attrs.push(new_extra_attrs[0]);
        right_extra_attrs.push(new_extra_attrs[1]);
      } else {
        const half = Math.floor(len / 2);
        const remainder = len % 2;
        const middel = remainder === 0 ? half - 1 : half;
        // left
        for (let l = 0; l <= middel; l++ ) {
          left_extra_attrs.push(new_extra_attrs[l]);
        }
        // right
        for (let r = middel + 1; r < len ; r++ ) {
          right_extra_attrs.push(new_extra_attrs[r]);
        }
      }
    }
    return [left_extra_attrs, right_extra_attrs];
  }
  // get minial atrtr label
  getMinimalLabels(attrs: Array<string>): Array<any> {
    const labels: Array<any> = new Array<any>();
    attrs.forEach((a: string) => {
      const obj = {};
      obj['name'] = a;
      if (a === 'attachments') {
        obj['label'] = this.utilityService.getCustomizedSampleAttachmentAttrLabel(a, this.customized_attrs)
      } else {
        obj['label'] = this.utilityService.getCustomizedSampleAttrLabel(a, this.customized_attrs);
      }
      labels.push(obj);
    });
    return labels;
  }
  updateFormGroup(fb: FormBuilder, fb_values: Array<string>, ctype: CType, fb_group_controlsConfig: any) {
    fb_group_controlsConfig = {
      'ctype': [ctype.type, Validators.required],
      'name': [(fb_values['name'] !== undefined ? fb_values['name'] : null), Validators.required],
      'color': [fb_values['color'] !== undefined ? fb_values['color'] : null, ],
      'storage_date': [, ], // will be update later on
      'attachment': [(fb_values['attachment'] !== undefined ? fb_values['attachment'] : null), ]
    }
    // get the minmal extra for csample
    const minimal_attrs = this.minimal_attrs;
    this.extra_attrs = this.getMinimalLabels(minimal_attrs);
    // extra atta in the ctype
    ctype.attrs.forEach((attr: CTypeAttr) => {
      const obj = {};
      // type, is_required, label
      // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
      if (+attr.attr_value_type !== 3) {
        // no sub attrs
        this.extra_attrs.push(
          {'pk': attr.pk,
            'name': attr.attr_name,
            'label': attr.attr_label.toUpperCase(),
            'attr': this.utilityService.decodeCTPyeInputAttr(attr)});
        fb_group_controlsConfig = Object.assign({}, fb_group_controlsConfig, this.genFbConfigObjNoSubAttr(attr));
      } else {
        this.has_subattr = true;
        // update subattr extra_attrs
        const extra_label = {};
        extra_label['pk'] = attr.pk;
        extra_label['name'] = attr.attr_name;
        extra_label['label'] = attr.attr_label;
        extra_label['subattrs'] = [];
        attr.subattrs.forEach((subattr: CTypeSubAttr) => {
          const extra_sublabel = {
          'pk': subattr.pk,
          'name': subattr.attr_name,
          'label': subattr.attr_label.toUpperCase(),
          'attr': this.utilityService.decodeCTPyeInputAttr(subattr)};
          extra_label['subattrs'].push(extra_sublabel);
        });
        this.extra_attrs.push(extra_label);
        // add_subattr.attr_label
        // this.subattr_handler
        obj[attr.attr_name] = fb.array([
          this.genSubfbConfig(fb, attr.subattrs)
        ]);
        fb_group_controlsConfig = Object.assign({}, fb_group_controlsConfig, obj);
      }
    });
    return fb.group(fb_group_controlsConfig);
  }
  // gen attr fb obj
  genFbConfigObjNoSubAttr (attr: CTypeAttr) {
    const obj = {}
    if (+attr.attr_value_type === 0) {
      // string
      // need to deal with length
      // attr_value_text_max_length
      obj[attr.attr_name]  = attr.attr_required
      ? (
          attr.attr_value_text_max_length !== undefined && attr.attr_value_text_max_length !== null
          ? [, Validators.compose([Validators.required, Validators.maxLength(+attr.attr_value_text_max_length)])]
          : [, Validators.required]
        )
      : (
          attr.attr_value_text_max_length !== undefined && attr.attr_value_text_max_length !== null
          ? [, Validators.maxLength(+attr.attr_value_text_max_length)]
          : [, ]
        );
    } else if (+attr.attr_value_type === 2) {
      // decimal, float
      // need to validate a decimal
      obj[attr.attr_name]  = attr.attr_required
      ? [, Validators.compose([Validators.required,
        this.cValidators.decimalValidator(+attr.attr_value_decimal_total_digit, +attr.attr_value_decimal_point, true)])]
      : [, Validators.compose([
        this.cValidators.decimalValidator(+attr.attr_value_decimal_total_digit, +attr.attr_value_decimal_point, true)])];
    } else if (+attr.attr_value_type === 1) {
      // digit
      // need to validate a digit
      obj[attr.attr_name]  = attr.attr_required
      ?  [, Validators.compose([Validators.required, this.cValidators.numberPostiveValidator()])]
      :  [, Validators.compose([this.cValidators.numberPostiveValidator()])];
    } else {
      // date
      this.date_attrs[attr.attr_name] = '';
      // need to validate a date
      obj[attr.attr_name]  = attr.attr_required
      ?  [this.date_attrs[attr.attr_name], Validators.compose([Validators.required])]
      :  [this.date_attrs[attr.attr_name], ];
    }
    return obj;
  }
  // gen sub_fb_config
  genSubfbConfig(fb: FormBuilder, subattrs: Array<CTypeSubAttr>) {
    const sub_fb_config = {};
    subattrs.forEach((attr: CTypeSubAttr) => {
      const obj = {};
      if (+attr.attr_value_type === 0) {
        // string
        // need to deal with length
        // attr_value_text_max_length
        obj[attr.attr_name]  = attr.attr_required
        ? (
            attr.attr_value_text_max_length !== undefined && attr.attr_value_text_max_length !== null
            ? [, Validators.compose([Validators.required, Validators.maxLength(+attr.attr_value_text_max_length)])]
            : [, Validators.required]
          )
        : (
            attr.attr_value_text_max_length !== undefined && attr.attr_value_text_max_length !== null
            ? [, Validators.maxLength(+attr.attr_value_text_max_length)]
            : [, ]
          );
      } else if (+attr.attr_value_type === 2) {
        // decimal, float
        // need to validate a decimal
        obj[attr.attr_name]  = attr.attr_required
        ? [, Validators.compose([Validators.required,
          this.cValidators.decimalValidator(+attr.attr_value_decimal_total_digit, +attr.attr_value_decimal_point, true)])]
        : [, Validators.compose([
          this.cValidators.decimalValidator(+attr.attr_value_decimal_total_digit, +attr.attr_value_decimal_point, true)])];
      } else if (+attr.attr_value_type === 1) {
        // digit
        // need to validate a digit
        obj[attr.attr_name]  = attr.attr_required
        ?  [, Validators.compose([Validators.required, this.cValidators.numberPostiveValidator()])]
        :  [, Validators.compose([this.cValidators.numberPostiveValidator()])];
      } else {
        // date
        const date = {};
        date[attr.attr_name] = '';
        // create if not exist
        if (this.date_attrs[attr.parent_attr] === undefined) {
          this.date_attrs[attr.parent_attr] = [];
        }
        this.date_attrs[attr.parent_attr].push(date);
        // need to validate a date
        obj[attr.attr_name]  = attr.attr_required
        ?  [, Validators.compose([Validators.required])]
        :  [, ];
      }
      Object.assign(sub_fb_config, obj)
    });
    return fb.group(sub_fb_config);
  }
  // check upload photo
  validateAttachmentUpload(event: EventTarget) {
      const eventObj: MSInputMethodContext = <MSInputMethodContext> event;
      const target: HTMLInputElement = <HTMLInputElement> eventObj.target;
      const files: FileList = target.files;
      this.file = files[0];
      // console.log(this.file);
      this.attchment_name = this.file.name;
      // check file size
      const size = this.file.size / 1024 / 1024
      if (parseInt(size.toFixed(2), 10) > 10) {
          this.attchament_is2large = true;
      } else {
        this.attchament_is2large = false;
      }
  }
  // gen subattr handler
  genSubAttrHandlers(formGroup: FormGroup, ctype: CType) {
    const handler = {};
    ctype.attrs.forEach((attr: CTypeAttr) => {
      if (+attr.attr_value_type === 3) {
        // add handler
        handler['add_' + attr.attr_name] = () => {
          const control = <FormArray>formGroup.controls[attr.attr_name];
          control.push(this.genSubfbConfig(this.fb, attr.subattrs));
        }
        // remove handler
        handler['remove_' + attr.attr_name] = (i: number) => {
          const control = <FormArray>formGroup.controls[attr.attr_name];
          control.removeAt(i);
          if (this.date_attrs[attr.attr_name] !== undefined) {
            this.date_attrs[attr.attr_name].splice(i, 1)
          }
        }
      }
    })
    return handler;
  }
  // add_column
  add_column(attr_name: string) {
    return this.subattr_handler['add_' + attr_name]();
  }
  remove_column(attr_name: string, i: number) {
    return this.subattr_handler['remove_' + attr_name](i);
  }
  updateSampleDate(value: any) {
    this.freezing_date = value.formatted;
  }
  updateStorageDate(value: any) {
    this.storage_date = value.formatted;
  }
  updateDate(value: any, attr: any) {
    this.date_attrs[attr.name] = value.formatted;
    this.sampleForm.controls[attr.name].setValue(this.date_attrs[attr.name]);
  }
  updateSubDate(value: any, attr_name: string, i: number, subattr_name) {
    this.date_attrs[attr_name][i][subattr_name] = value.formatted;
    const pfb = <FormArray>this.sampleForm.controls[attr_name];
    (<FormGroup>pfb.controls[i]).controls[subattr_name].setValue(value.formatted);
  }
  updateSampleColor(value: any) {
    this.color = value;
  }
  // route force refrsh
  forceRefresh() {
    this.router.navigate(['/containers', this.container.pk], { queryParams: { 'box_position': this.box.box_position } });
  }

  onCreate(values: any) {
    let posted_values = {};
    if (values.name == null || values.type === '-') {
      this.form_valid = false;
    } else {
      values.color = this.color;
      if (!this.USE_CSAMPLE) {
        values.freezing_date = this.freezing_date;
        posted_values = values;
      } else {
        values.storage_date = this.storage_date;
      // convert type name to pk
      const ctype_pk: number = this.ctypeService.convertCTypeName2PK(values.ctype, this.all_ctypes);
      if (ctype_pk === null) {
        this.form_valid = false;
      } else {
        values.ctype = ctype_pk;
      }
      // for obj for saving
      posted_values = this.ctypeService.formatCSample4Saving(values, this.all_ctypes);
    }
      // console.log(posted_values);
      const label = this.attachmentLabelInput.nativeElement.value
      const description = this.attachmentDescriptionInput.nativeElement.value;
      // console.log(values);
      const formData: FormData = new FormData();
      formData.append('obj', JSON.stringify(posted_values));
      formData.append('slots', JSON.stringify(this.slots))
      if (this.file) {
        formData.append('file', this.file, this.file.name);
        const attachment_info = {
          'label': label,
          'attachment_name': this.attchment_name,
          'description': description}
        formData.append('attachment_info', JSON.stringify(attachment_info));
      }
      this.form_valid = true;
      this.saving = true;
      this.containerService.addSamples(formData, this.container.pk, this.box.box_position)
      .subscribe((data: any) => {
        // after saving
        this.localStorageService.emptySelectedCells = [];
        this.saving = false;
        this.alertService.success('Samples at ' + data.slots + ' are stored successfully!', true);
        this.forceRefresh();
      },
      (err) => {
        // after saving
        this.localStorageService.emptySelectedCells = [];
        this.saving = false;
        this.alertService.error('Failed to store the new samples!', true);
        this.forceRefresh();
        console.log(err);
      });
    }
  }
}
