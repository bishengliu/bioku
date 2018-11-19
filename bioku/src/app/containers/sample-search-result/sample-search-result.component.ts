import { Component, OnInit, OnChanges, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Sample } from '../../_classes/Sample';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType } from '../../_classes/CType';
import { AppSetting } from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { UtilityService } from '../../_services/UtilityService';
import { CTypeService } from '../../_services/CTypeService';
@Component({
  selector: 'app-sample-search-result',
  templateUrl: './sample-search-result.component.html',
  styleUrls: ['./sample-search-result.component.css']
})
export class SampleSearchResultComponent implements OnInit, OnChanges {
  @Input() samples = []; // Sample or CSample
  @Input() searched: boolean;
  selectedSamples: Array<number> = [] // sample pk
  @Output() sampleSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>> ();
  @Output() sampleDbClicked: EventEmitter<number> = new EventEmitter<number> ();
  appUrl: string;
  loading: Boolean = true;
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
  // CUSTOM SAMPEL CODE NAME
  custom_sample_code_name = 'sample code';
  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService, private ctypeService: CTypeService, ) {
    this.appUrl = this.appSetting.URL;
    // for redering sample name
    this.SHOW_ORIGINAL_NAME = this.appSetting.SHOW_ORIGINAL_NAME;
    this.NAME_MIN_LENGTH = this.appSetting.NAME_MIN_LENGTH;
    this.NAME_MIN_right_LENGTH = this.appSetting.NAME_MIN_right_LENGTH;
    this.NAME_SYMBOL = this.appSetting.NAME_SYMBOL;
    this.custom_sample_code_name = this.appSetting.CUSTOM_SAMPLE_CODE_NAME;
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
    this.DISPLAY_COMMON_ATTRS = this.appSetting.DISPLAY_COMMON_ATTRS;
  }

  ngOnInit() {
    this.sampleSelected.emit([]); // emit empty sample selected
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
  renderSampleName(sampleName: string) {
    return this.utilityService.renderSampleName(sampleName, this.SHOW_ORIGINAL_NAME,
      this.NAME_MIN_LENGTH, this.NAME_MIN_right_LENGTH, this.NAME_SYMBOL);
  }
  getSampleTypes() {
    this.sample_types = [];
    this.sample_types = Object.assign([], this.ctypeService.getSampleTypes(this.USE_CSAMPLE, this.samples));
  }
  hasSample(sampleType: string) {
    if (sampleType !== undefined && sampleType !== null && sampleType !== '') {
      return this.sample_types.indexOf(sampleType) === -1 ? false : true;
    }
    return false;
  }
  // get sample top level attrs
  // only for USE_CSAMPLE
  genTableHeaders() {
    this.sample_attrs = this.ctypeService
    .genSamplesAttrs(this.samples, this.USE_CSAMPLE, this.DISPLAY_COMMON_ATTRS, this.all_ctypes, this.sample_types);
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
  getBasicAttrLabel(name: string) {
    return this.utilityService.getCustomizedSampleAttrLabel(name);
  }
  // calColspan() {
  //   let colspan = 1;
  //   const general_count = 10;
  //   colspan += general_count;
  //   this.sample_types.indexOf('CONSTRUCT') !== -1 ?  colspan += 8 : colspan += 0;
  //   this.sample_types.indexOf('OLIGO') !== -1 || this.sample_types.indexOf('gRNA_OLIGO') !== -1 ?  colspan += 6 : colspan += 0;
  //   this.sample_types.indexOf('CELL') !== -1 ?  colspan += 3 : colspan += 0;
  //   this.sample_types.indexOf('VIRUS') !== -1 ?  colspan += 5 : colspan += 0;
  //   this.sample_types.indexOf('TISSUE') !== -1 ?  colspan += 2 : colspan += 0;
  //   return colspan;
  // }
  // display sample details upon dbclick
  dbClickSample(sample: Sample | CSample) {
    if (sample !== undefined && sample !== null && sample.pk) {
      this.sampleDbClicked.emit(sample.pk);
    }
    // console.log(sample);
  }
  ngOnChanges() {
    this.loading = true;
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
    this.selectedSamples = []; // clear selected samples
    this.sampleSelected.emit([]); // emit selected sample pk
  }

}
