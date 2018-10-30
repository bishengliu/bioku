import { Component, OnInit, Input, OnChanges, Inject } from '@angular/core';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType, CSubAttrData } from '../../_classes/CType';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { AppStore } from '../../_providers/ReduxProviders';
import { CTypeService } from '../../_services/CTypeService';
import {  UtilityService } from '../../_services/UtilityService';

@Component({
  selector: 'app-csample-view-detail',
  templateUrl: './csample-view-detail.component.html',
  styleUrls: ['./csample-view-detail.component.css']
})
export class CsampleViewDetailComponent implements OnInit, OnChanges {
  @Input() sample = new CSample();
  // public modal: SuiModal<Sample, void, void>;
  appUrl: string;
  display_sample: any = {};
  attrs: Array<string> = new Array<string>();
  subattr_data: Array<Array<CSubAttrData>> = new Array<Array<CSubAttrData>>();
  // FOR RENDERING SAMPLE NAME
  SHOW_ORIGINAL_NAME: false;
  NAME_MIN_LENGTH: 15;
  NAME_MIN_right_LENGTH: 10;
  NAME_SYMBOL: '...';
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
  private ctypeService: CTypeService, private utilityService: UtilityService) { 
    this.appUrl = this.appSetting.URL;
    // for redering sample name
    this.SHOW_ORIGINAL_NAME = this.appSetting.SHOW_ORIGINAL_NAME;
    this.NAME_MIN_LENGTH = this.appSetting.NAME_MIN_LENGTH;
    this.NAME_MIN_right_LENGTH = this.appSetting.NAME_MIN_right_LENGTH;
    this.NAME_SYMBOL = this.appSetting.NAME_SYMBOL;
  }
  ngOnInit() {}
  renderSampleName(sampleName: string) {
    return this.utilityService.renderSampleName(sampleName, this.SHOW_ORIGINAL_NAME,
      this.NAME_MIN_LENGTH, this.NAME_MIN_right_LENGTH, this.NAME_SYMBOL);
  }
  ngOnChanges() {
    this.attrs= this.ctypeService.genSampleAttrs(this.sample);
    this.display_sample = this.ctypeService.genDisplaySample(this.sample, this.attrs);
    this.subattr_data = this.ctypeService.genSubAttrData(this.sample);
    // console.log(this.display_sample);
    console.log(this.subattr_data);
  }
}
