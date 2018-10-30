import { Component, OnInit, OnChanges, Input, Inject } from '@angular/core';
import { Sample } from '../../_classes/Sample';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import {  UtilityService } from '../../_services/UtilityService';

@Component({
  selector: 'app-sample-view-detail',
  templateUrl: './sample-view-detail.component.html',
  styleUrls: ['./sample-view-detail.component.css']
})
export class SampleViewDetailComponent implements OnInit {
  @Input() sample = new Sample();
  // public modal: SuiModal<Sample, void, void>;
  appUrl: string;
  // FOR RENDERING SAMPLE NAME
  SHOW_ORIGINAL_NAME: false;
  NAME_MIN_LENGTH: 15;
  NAME_MIN_right_LENGTH: 10;
  NAME_SYMBOL: '...';
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
  private utilityService: UtilityService) {
    this.appUrl = this.appSetting.URL;
    // for redering sample name
    this.SHOW_ORIGINAL_NAME = this.appSetting.SHOW_ORIGINAL_NAME;
    this.NAME_MIN_LENGTH = this.appSetting.NAME_MIN_LENGTH;
    this.NAME_MIN_right_LENGTH = this.appSetting.NAME_MIN_right_LENGTH;
    this.NAME_SYMBOL = this.appSetting.NAME_SYMBOL;
   }
   renderSampleName(sampleName: string) {
    return this.utilityService.renderSampleName(sampleName, this.SHOW_ORIGINAL_NAME,
      this.NAME_MIN_LENGTH, this.NAME_MIN_right_LENGTH, this.NAME_SYMBOL);
  }
  ngOnInit() {
  }

}
