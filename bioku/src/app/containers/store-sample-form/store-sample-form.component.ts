import { Component, OnInit, OnChanges, Inject, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
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
  extra_attrs: Array<any> = new Array<any>();
  // add or remove function
  subattr_handler: Array<any> = new Array<any>();
  private customized_attrs: Array<any> = new Array<any> ();
  constructor(@Inject(APP_CONFIG) private appSetting: any, private containerService: ContainerService, private ctypeService: CTypeService,
              private cValidators: CustomFormValidators, private alertService: AlertService, private router: Router,
              private utilityService: UtilityService, private route: ActivatedRoute,
              fb: FormBuilder, private localStorageService: LocalStorageService) {
    this.appUrl = this.appSetting.URL;
    this.availableColors = this.appSetting.APP_COLORS;
    this.custom_sample_code_name = this.appSetting.CUSTOM_SAMPLE_CODE_NAME.toLowerCase();
    this.sample_type = '-';
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
    this.failed = false;
    this.customized_attrs = this.appSetting.CUSTOMIZED_ATTRS;
    // get all sample ctypes
    if (this.USE_CSAMPLE) {
      this.ctypeService.getCTypes()
      .subscribe((ctypes: Array<CType>) => {
        this.all_ctypes = ctypes;
        console.log(this.all_ctypes);
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
    const minimal_attrs = ['ctype', 'name', 'color', 'storage_date', 'attachment'];
    this.extra_attrs = this.getMinimalLabels(minimal_attrs);
    this.sampleForm = this.USE_CSAMPLE
    ? fb.group(this.fb_group_controlsConfig)
    : this.sampleForm = fb.group({
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
      // get the selected ctype
      const ctypes: Array<CType> = this.ctypeService.getCTypesByNames([this.sample_type], this.all_ctypes);
      this.ctype = ctypes[0];
      // FIND EXTRA SAMPLE ATTRS
      // this.extra_attrs = this.getExtraAttrs(this.sample_type, this.all_ctypes);
      // get current form values
      const fb_values = this.sampleForm.value;
      // update fromgroup

      // format left and right extra attrs
    }
  }

  // getExtraAttrs(sample_types: string, all_ctypes: Array<CType>) {
  //   // get the relavent ctypes
  //   const exclude_date = false;
  //   const ctypes: Array<CType> = this.ctypeService.getCTypesByNames([sample_types], all_ctypes);
  //   return this.ctypeService.getMaxAttrs(ctypes, exclude_date);
  // }
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
    'name': [(fb_values['name'] !== undefined ? fb_values['name'] : null), ],
    'color': [fb_values['color'] !== undefined ? fb_values['color'] : null, ],
    'storage_date': [, ], // will be update later on
    'attachment': [(fb_values['attachment'] !== undefined ? fb_values['attachment'] : null), ]
  }
  // get the minmal extra for csample
  const minimal_attrs = ['ctype', 'name', 'color', 'storage_date', 'attachment'];
  this.extra_attrs = this.getMinimalLabels(minimal_attrs);
  // extra atta in the ctype
  ctype.attrs.forEach((attr: CTypeAttr) => {
    const obj = {};
    // type, is_required, label
    // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
    if (+attr.attr_value_type !== 3) {
      // no sub attrs
      this.extra_attrs.push({'name': attr.attr_name, 'label': attr.attr_label.toUpperCase()});
      fb_group_controlsConfig = Object.assign({}, fb_group_controlsConfig, this.genFbConfigObjNoSubAttr(attr));
    } else {
      // update extra_attrs
      const extra_label = {};
      extra_label['name'] = attr.attr_name;
      extra_label['label'] = [];
      attr.subattrs.forEach((subattr: CTypeSubAttr) => {
        const extra_sublabel = {'name': subattr.attr_name, 'label': subattr.attr_label.toUpperCase()};
        extra_label['label'].push(extra_sublabel);
      });
      this.extra_attrs.push(extra_label);
      // add_subattr.attr_label
      // this.subattr_handler
      obj[attr.attr_name] = fb.array([
        this.genSubfbConfig(fb, attr.subattrs)
      ]);
      // add function 

      // remove function
      
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
  } else if (+attr.attr_value_type === 1) {
    // digit
    // need to validate a number
    obj[attr.attr_name]  = attr.attr_required
    ? [, Validators.compose([Validators.required,
      this.cValidators.decimalValidator(+attr.attr_value_decimal_total_digit, +attr.attr_value_decimal_point, true)])]
    : [, Validators.compose([
      this.cValidators.decimalValidator(+attr.attr_value_decimal_total_digit, +attr.attr_value_decimal_point, true)])];
  } else if (+attr.attr_value_type === 2) {
    // decimal
    // need to validate a decimal
    // Validators.compose([Validators.required, this.cValidators.digitValidator()])
    obj[attr.attr_name]  = attr.attr_required
    ?  [, Validators.compose([Validators.required, this.cValidators.numberPostiveValidator()])]
    :  [, Validators.compose([this.cValidators.numberPostiveValidator()])];
  } else {
    // date
    // need to validate a date
    obj[attr.attr_name]  = attr.attr_required
    ?  [, Validators.compose([Validators.required, this.cValidators.dateValidator()])]
    :  [, Validators.compose([this.cValidators.dateValidator()])];
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
    } else if (+attr.attr_value_type === 1) {
      // digit
      // need to validate a number
      obj[attr.attr_name]  = attr.attr_required
      ? [, Validators.compose([Validators.required,
        this.cValidators.decimalValidator(+attr.attr_value_decimal_total_digit, +attr.attr_value_decimal_point, true)])]
      : [, Validators.compose([
        this.cValidators.decimalValidator(+attr.attr_value_decimal_total_digit, +attr.attr_value_decimal_point, true)])];
    } else if (+attr.attr_value_type === 2) {
      // decimal
      // need to validate a decimal
      // Validators.compose([Validators.required, this.cValidators.digitValidator()])
      obj[attr.attr_name]  = attr.attr_required
      ?  [, Validators.compose([Validators.required, this.cValidators.numberPostiveValidator()])]
      :  [, Validators.compose([this.cValidators.numberPostiveValidator()])];
    } else {
      // date
      // need to validate a date
      obj[attr.attr_name]  = attr.attr_required
      ?  [, Validators.compose([Validators.required, this.cValidators.dateValidator()])]
      :  [, Validators.compose([this.cValidators.dateValidator()])];
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

  updateSampleDate(value: any) {
    this.freezing_date = value.formatted;
  }
  updateStorageDate(value: any) {
    this.storage_date = value.formatted;
  }
  updateSampleColor(value: any) {
    this.color = value;
  }
  // route force refrsh
  forceRefresh() {
    this.router.navigate(['/containers', this.container.pk], { queryParams: { 'box_position': this.box.box_position } });
  }

  onCreate(values: any) {
    if (values.name == null || values.type === '-') {
      this.form_valid = false;
    } else {
      values.color = this.color;
      values.freezing_date = this.freezing_date;
      const label = this.attachmentLabelInput.nativeElement.value
      const description = this.attachmentDescriptionInput.nativeElement.value;
      const formData: FormData = new FormData();
      formData.append('obj', JSON.stringify(values));
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
