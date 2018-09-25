import { Component, OnInit, OnChanges, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Sample } from '../../_classes/Sample';
import { AppSetting } from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import {  UtilityService } from '../../_services/UtilityService';
@Component({
  selector: 'app-sample-search-result',
  templateUrl: './sample-search-result.component.html',
  styleUrls: ['./sample-search-result.component.css']
})
export class SampleSearchResultComponent implements OnInit, OnChanges {
  @Input() samples: Array<Sample>;
  @Input() searched: boolean;
  selectedSamples: Array<number> = [] // sample pk
  @Output() sampleSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>> ();
  @Output() sampleDbClicked: EventEmitter<number> = new EventEmitter<number> ();
  appUrl: string;
  // FOR RENDERING SAMPLE NAME
  SHOW_ORIGINAL_NAME: false;
  NAME_MIN_LENGTH: 15;
  NAME_MIN_right_LENGTH: 10;
  NAME_SYMBOL: '...';
  // sample types in the box
  sample_types: Array<string> = [];
  all_sample_types: Array<string> = [];
  // CUSTOM SAMPEL CODE NAME
  custom_sample_code_name = 'sample code';
  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService) {
    this.appUrl = this.appSetting.URL;
    // for redering sample name
    this.SHOW_ORIGINAL_NAME = this.appSetting.SHOW_ORIGINAL_NAME;
    this.NAME_MIN_LENGTH = this.appSetting.NAME_MIN_LENGTH;
    this.NAME_MIN_right_LENGTH = this.appSetting.NAME_MIN_right_LENGTH;
    this.NAME_SYMBOL = this.appSetting.NAME_SYMBOL;
    this.all_sample_types = this.appSetting.SAMPLE_TYPE;
    this.custom_sample_code_name = this.appSetting.CUSTOM_SAMPLE_CODE_NAME;
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
    this.all_sample_types.forEach((type: string) => {
      const sample_found: Sample = this.samples.find((sample: Sample) => sample.type === type);
      if (sample_found !== undefined && this.sample_types.indexOf(type) === -1) {
        this.sample_types.push(type);
      }
    })
  }
  hasSample(sampleType: string) {
    if (sampleType !== undefined && sampleType !== null && sampleType !== '') {
      return this.sample_types.indexOf(sampleType) === -1 ? false : true;
    }
    return false;
  }
  calColspan() {
    let colspan = 1;
    const general_count = 10;
    colspan += general_count;
    this.sample_types.indexOf('CONSTRUCT') !== -1 ?  colspan += 8 : colspan += 0;
    this.sample_types.indexOf('OLIGO') !== -1 || this.sample_types.indexOf('gRNA_OLIGO') !== -1 ?  colspan += 6 : colspan += 0;
    this.sample_types.indexOf('CELL') !== -1 ?  colspan += 3 : colspan += 0;
    this.sample_types.indexOf('VIRUS') !== -1 ?  colspan += 5 : colspan += 0;
    this.sample_types.indexOf('TISSUE') !== -1 ?  colspan += 2 : colspan += 0;
    return colspan;
  }
  // display sample details upon dbclick
  dbClickSample(sample: Sample) {
    if (sample !== undefined && sample !== null && sample.pk) {
      this.sampleDbClicked.emit(sample.pk);
    }
    // console.log(sample);
  }
  ngOnChanges() {
    // get the sample types
    this.getSampleTypes();
    this.selectedSamples = []; // clear selected samples
    this.sampleSelected.emit([]); // emit selected sample pk
  }

}
