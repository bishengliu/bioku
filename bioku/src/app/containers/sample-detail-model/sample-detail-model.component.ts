import { Component, OnInit, OnChanges, Input, Inject, OnDestroy } from '@angular/core';
// import { SuiModal, ComponentModalConfig, ModalSize, SuiModalService, SuiModalModule} from 'ng2-semantic-ui';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType } from '../../_classes/CType';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
import { ContainerService } from '../../_services/ContainerService';
@Component({
  selector: 'app-sample-detail-model',
  templateUrl: './sample-detail-model.component.html',
  styleUrls: ['./sample-detail-model.component.css']
})
export class SampleDetailModelComponent implements OnInit, OnChanges {
  @Input() samplePK: number; // pass only sample pk
  @Input() samples = []; // sample of csample;
  @Input() DbClickCount: number;
  sample;
  activated = false;
  // public modal: SuiModal<Sample, void, void>;
  appUrl: string;
  // CUSTOM SAMPEL CODE NAME
  custom_sample_code_name = 'sample code';
  USE_CSAMPLE = true;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
              private containerService: ContainerService ) {
    this.appUrl = this.appSetting.URL;
    this.custom_sample_code_name = this.appSetting.CUSTOM_SAMPLE_CODE_NAME;
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
    if (this.USE_CSAMPLE) {
      this.sample = new Sample();
    } else {
      this.sample = new CSample();
    }
  }
  ngOnInit() {}
  ngOnChanges() {
    // use DbClickCount to triger changes
    if (this.samplePK !== null && +this.samplePK > 0) {
      // get sample details from the server
      this.sample = this.findSample(+this.samplePK);
      console.log(this.sample);
      // retrieve sample relation here
      this.activateModal();
    }
  }
  activateModal() {
    this.activated = true;
  }
  dismissModal(event) {
    this.activated = false;
  }
  cancelPropagation(event) {
    event.stopPropagation();
  }
  findSample(pk: number) {
    if (this.USE_CSAMPLE) {
      let sample: CSample = new CSample();
      if (pk != null) {
        const samples = this.samples.filter((s: CSample) => { return +pk === s.pk; });
        if (samples != null && samples.length === 1) { sample = samples[0]; }
      }
      return sample;
    } else {
      let sample: Sample = new Sample();
      if (pk != null) {
        const samples = this.samples.filter((s: Sample) => { return +pk === s.pk; });
        if (samples != null && samples.length === 1) { sample = samples[0]; }
      }
      return sample;
    }
  }
}
