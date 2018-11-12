import { Component, OnInit, OnChanges, Inject, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting } from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType, CSubAttrData } from '../../_classes/CType';
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
  // loading falied
  failed = false;
  fb_group_controlsConfig = {};
  extra_attrs: Array<String> = new Array<String>();
  left_extra_attrs: Array<Array<String>> = new Array<Array<String>> ();
  right_extra_attrs: Array<Array<String>> = new Array<Array<String>> ();
  constructor(@Inject(APP_CONFIG) private appSetting: any, private containerService: ContainerService, private ctypeService: CTypeService,
              private cValidators: CustomFormValidators, private alertService: AlertService, private router: Router,
              private route: ActivatedRoute, fb: FormBuilder, private localStorageService: LocalStorageService) {
    this.appUrl = this.appSetting.URL;
    this.availableColors = this.appSetting.APP_COLORS;
    this.custom_sample_code_name = this.appSetting.CUSTOM_SAMPLE_CODE_NAME.toLowerCase();
    this.sample_type = '-';
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
    this.failed = false;
    // get all sample ctypes
    if (this.USE_CSAMPLE) {
      this.ctypeService.getCTypes()
      .subscribe((ctypes: Array<CType>) => {
        this.all_ctypes = ctypes;
      },
      () => {
        this.failed = true;
        this.alertService.error('failed to retrieve sample types, please refresh the page or contact the support!', false);
      });
    } else {
      this.all_sample_types = this.appSetting.SAMPLE_TYPE;
    }

    this.fb_group_controlsConfig = {
      'type': [, Validators.required],
      'name': [, Validators.required],
      'color': [, ],
      'freezing_date': [, ],
      'attachment': [, ]
    }
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
      // FIND EXTRA SAMPLE ATTRS

      // get current form values

      // update fromgroup

      // format left and right extra attrs
    }
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
