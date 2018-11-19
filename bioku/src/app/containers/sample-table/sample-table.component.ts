import { Component, OnInit, OnChanges, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
// color picker
import { IColorPickerConfiguration } from 'ng2-color-picker';

import { AppSetting } from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { Sample, Attachment } from '../../_classes/Sample';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType } from '../../_classes/CType';
import { ContainerService } from '../../_services/ContainerService';
import { CTypeService } from '../../_services/CTypeService';
import { UtilityService } from '../../_services/UtilityService';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
@Component({
  selector: 'app-sample-table',
  templateUrl: './sample-table.component.html',
  styleUrls: ['./sample-table.component.css']
})
export class SampleTableComponent implements OnInit, OnChanges {
  @Input() samples = []; // sample of csample;
  selectedSamples: Array<number> = [] // sample pk
  @Output() sampleSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>> ();
  @Output() sampleDbClicked: EventEmitter<number> = new EventEmitter<number> ();
  appUrl: string;
  @Input() container: Container;
  @Input() box: Box;
  loading: Boolean = true;
  currentSampleCount = 0; // active samples in the box
  totalBoxCapacity: number;
  user: User;
  rate = 0;
  color = '#ffffff'; // box color
  // CUSTOM SAMPEL CODE NAME
  custom_sample_code_name = 'sample code';
  // color picker
  availableColors: Array<string> = [];
  pickerOptions: IColorPickerConfiguration = {
    width: 25,
    height: 25,
    borderRadius: 4};
  // FOR RENDERING SAMPLE NAME
  SHOW_ORIGINAL_NAME: false;
  NAME_MIN_LENGTH: 15;
  NAME_MIN_right_LENGTH: 10;
  NAME_SYMBOL: '...';
  // all ctypes
  all_ctypes: Array<CType> = new Array<CType>();
  // sample types in the box
  sample_types: Array<string> = [];
  // displayed attrs
  sample_attrs: Array<string> = [];
  // all_sample_types: Array<string> = [];
  USE_CSAMPLE = true;
  // SHOW COMMON ATTRS
  DISPLAY_COMMON_ATTRS = true;
  // samples for display
  displayed_samples: Array<any> = [];
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private ctypeService: CTypeService,
              private containerService: ContainerService, private utilityService: UtilityService) {
    this.appUrl = this.appSetting.URL;
    this.availableColors = this.appSetting.APP_COLORS;
    // for redering sample name
    this.SHOW_ORIGINAL_NAME = this.appSetting.SHOW_ORIGINAL_NAME;
    this.NAME_MIN_LENGTH = this.appSetting.NAME_MIN_LENGTH;
    this.NAME_MIN_right_LENGTH = this.appSetting.NAME_MIN_right_LENGTH;
    this.NAME_SYMBOL = this.appSetting.NAME_SYMBOL;
    this.custom_sample_code_name = this.appSetting.CUSTOM_SAMPLE_CODE_NAME;
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
    this.DISPLAY_COMMON_ATTRS = this.appSetting.DISPLAY_COMMON_ATTRS;
  }
  toggleSelection(pk: number) {
    if (pk != null) {
      const index = this.selectedSamples.indexOf(pk);
      if (index === -1) {
        this.selectedSamples.push(pk);
      } else {
        this.selectedSamples.splice(index, 1);
      }
    }
    // emit observable
    this.sampleSelected.emit(this.selectedSamples);
  }
  // display sample details upon dbclick
  dbClickSample(sample: Sample | CSample) {
    if (sample !== undefined && sample !== null && sample.pk) {
      this.sampleDbClicked.emit(sample.pk);
    }
    // console.log(sample);
  }
  renderSampleName(sampleName: string) {
    return this.utilityService.renderSampleName(sampleName, this.SHOW_ORIGINAL_NAME,
      this.NAME_MIN_LENGTH, this.NAME_MIN_right_LENGTH, this.NAME_SYMBOL);
  }
  hasSample(sampleType: string) {
    if (sampleType !== undefined && sampleType !== null && sampleType !== '') {
      return this.sample_types.indexOf(sampleType) === -1 ? false : true;
    }
    return false;
  }
  genBorderStyle(color: string) {
    let cssValue = '1px solid rgba(34,36,38,.15)';
    if (color !== null && color !== '') {
      cssValue = '3px solid ' + color;
    }
    return cssValue;
  }
  ngOnInit() {
    this.sampleSelected.emit([]); // emit empty sample selected
  }
  getSampleTypes() {
    this.sample_types = [];
    this.sample_types = Object.assign([], this.ctypeService.getSampleTypes(this.USE_CSAMPLE, this.samples));
  }
  // sort samples
  sortSampleByPosition() {
    if (this.samples != null) {
      this.samples.sort(this.utilityService.sortArrayByMultipleProperty('vposition', 'hposition'));
    }
  }
  // get sample top level attrs
  // only for USE_CSAMPLE
  genTableHeaders() {
    this.sample_attrs = this.ctypeService
    .genSamplesAttrs(this.samples, this.USE_CSAMPLE, this.DISPLAY_COMMON_ATTRS, this.all_ctypes, this.sample_types);
  }
  getBasicAttrLabel(name: string) {
    return this.utilityService.getCustomizedSampleAttrLabel(name);
  }
  // gen displayed_samples
  genDisplaySamples() {
    if (this.samples != null && this.sample_attrs != null && this.USE_CSAMPLE) {
      this.displayed_samples = [];
      this.samples.forEach((s: CSample) => {
        const displayed_sample = this.ctypeService.genDisplaySample(s, this.sample_attrs);
        this.displayed_samples.push(displayed_sample);
      })
    }
    // console.log(this.displayed_samples);
  }
  ngOnChanges() {
    this.loading = true;
    // sort samples
    this.sortSampleByPosition();
    // get the sample types
    this.getSampleTypes();
    // process sample for display
    this.displayed_samples = [];
    // get all the ctypes
    if (this.USE_CSAMPLE) {
      this.ctypeService.getCTypes()
      .subscribe(
      (ctypes: Array<CType>) => {
        this.all_ctypes = [...ctypes];
        // get table headers
        this.genTableHeaders();
        // process sample according to the table headers
        this.genDisplaySamples();
        this.loading = false;
       },
      () => {
        this.DISPLAY_COMMON_ATTRS = false;
        // get table headers
      this.genTableHeaders();
      // process sample according to the table headers
      this.genDisplaySamples();
      this.loading = false;
      })
    } else {
      this.displayed_samples = this.samples;
      this.loading = false;
    }
    // console.log('sample types', this.sample_types);
    this.selectedSamples = []; // clear selected samples
    this.sampleSelected.emit(null); // emit selected sample pk
  }
}
