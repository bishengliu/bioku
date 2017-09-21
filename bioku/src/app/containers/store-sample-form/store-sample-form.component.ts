import { Component, OnInit, Inject, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { Container } from '../../_classes/Container';
import { ContainerService } from '../../_services/ContainerService';
import {  AlertService } from '../../_services/AlertService';
//custom from validator
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';
//mydatepicker
import {IMyOptions} from 'mydatepicker';
//color picker
import { IColorPickerConfiguration } from 'ng2-color-picker';
@Component({
  selector: 'app-store-sample-form',
  templateUrl: './store-sample-form.component.html',
  styleUrls: ['./store-sample-form.component.css']
})
export class StoreSampleFormComponent implements OnInit {
  @Input() cells: string;
  slots: Array<string> = new Array<string>();
  @Input() container: Container;
  @Input() box: Container;
  appUrl: string;
  //upload
  file: File;
  attchment_name: string;
  attchament_is2large: boolean = false;
  //SAPMPLE TYPE
  sample_type: string = '-';
  //ALL SAMPLE TYPES
  all_sample_types: Array<String> = new Array<String>();
  freezing_date = {};
  color: string = '#000000';
  //mydatepicker
  private myDatePickerOptions: IMyOptions = {
      // other options...
      todayBtnTxt: 'Today',
      dateFormat: 'yyyy-mm-dd',
      openSelectorTopOfInput: true,
      showSelectorArrow: false,
      editableDateField: false,
      openSelectorOnInputClick: true};

  //color picker
  availableColors: Array<string> = [];
  pickerOptions: IColorPickerConfiguration = {
    width: 12,
    height: 12,
    borderRadius: 2};
  //form group
  sampleForm: FormGroup;

  constructor(@Inject(APP_CONFIG) private appSetting: any, private containerService: ContainerService, private cValidators: CustomFormValidators,
              private alertService: AlertService, private router: Router, private route: ActivatedRoute, fb: FormBuilder,) {
    this.appUrl = this.appSetting.URL;
    this.availableColors = this.appSetting.APP_COLORS;
    this.all_sample_types = this.appSetting.SAMPLE_TYPE;
    this.sample_type = '-';
    //formGroup
    this.sampleForm = fb.group({
      //general
      'color':[, ],
      'type':[, Validators.required],
      'name': [, Validators.required],
      'official_name':[, ],
      'tag':[, ],
      'registration_code':[, ],
      'reference_code':[, ],
      'quantity':[, ],
      'quantity_unit':[, ],
      'freezing_code':[, ],
      'freezing_date':[, ],
      'description': [, ],
      'attachment_label': [, ],
      'attachment_description': [, ],
      //construct
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
      //cell
      'passage_number': [, ],
      'cell_amount': [, ],
      'project': [, ],
      'creator': [, ],
      //oligo
      'oligo_name': [, ],
      's_or_as': [, ],
      'oligo_sequence': [, ],
      'oligo_length': [, ],
      'oligo_GC': [, ],
      'target_sequence': [, ],
      //virus
      'plasmid': [, ],
      'titration_titer': [, ],
      'titration_unit': [, ],
      'titration_cell_type': [, ],
      'titration_code': [, ],
      //tissue
      'pathology_code': [, ],
      'tissue': [, ]
      });
  }

  ngOnInit() {}
  ngOnChanges(){
    //positions
    this.slots = [];
    if(this.cells != null && this.cells != ""){
      this.slots = this.cells.split(',');
    }
  }

  updateType(value:any){
    this.sample_type = value.target.value;
    console.log(this.sample_type);
  }
  //check upload photo
  validateAttachmentUpload(event: EventTarget) {
      let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
      let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
      let files: FileList = target.files;
      this.file = files[0];
      //console.log(this.file);
      this.attchment_name = this.file.name;
      //check file size
      let size = this.file.size / 1024 / 1024
      if (parseInt(size.toFixed(2)) > 10) {
          this.attchament_is2large = true;
      }
      else{
        this.attchament_is2large = false;
      }
  }

  updateSampleDate(value:any){
    this.freezing_date = value.formatted;
    console.log(this.freezing_date);
  }

  updateSampleColor(value:any){
    this.color = value;
    console.log(this.color);
  }

  onCreate(values: any){
    console.log('clicked...');
    values.color = this.color;
    values.freezing_date = this.freezing_date;
    console.log(values);
  }
}
