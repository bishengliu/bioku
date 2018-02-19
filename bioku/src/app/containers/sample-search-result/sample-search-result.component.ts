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
  appUrl: string;
  // FOR RENDERING SAMPLE NAME
  SHOW_ORIGINAL_NAME: false;
  NAME_MIN_LENGTH: 15;
  NAME_MIN_right_LENGTH: 10;
  NAME_SYMBOL: '...';
  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService) {
    this.appUrl = this.appSetting.URL;
    // for redering sample name
    this.SHOW_ORIGINAL_NAME = this.appSetting.SHOW_ORIGINAL_NAME;
    this.NAME_MIN_LENGTH = this.appSetting.NAME_MIN_LENGTH;
    this.NAME_MIN_right_LENGTH = this.appSetting.NAME_MIN_right_LENGTH;
    this.NAME_SYMBOL = this.appSetting.NAME_SYMBOL;
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
  ngOnChanges() {
    this.selectedSamples = []; // clear selected samples
    this.sampleSelected.emit([]); // emit selected sample pk
  }

}
