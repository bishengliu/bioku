import { Component, OnInit, OnChanges, Input, Inject } from '@angular/core';
import {SuiModal, ComponentModalConfig, ModalSize, SuiModalService, SuiModalModule} from 'ng2-semantic-ui';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
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
  modalSize = ModalSize.Large;
  sample: Sample = new Sample();
  modal_initiated = false;
  // public modal: SuiModal<Sample, void, void>;
  user: User;
  container: Container = null;
  box: Box = null;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
              private containerService: ContainerService, private modelService: SuiModalService) {
    appStore.subscribe(() => this.updateState());
    this.updateState();
  }
  ngOnInit() {}
  updateState() {
    const state = this.appStore.getState();
    if (state.authInfo && state.authInfo.authUser) {
      this.user = state.authInfo.authUser;
    }
    if (state.containerInfo && state.containerInfo.currentContainer) {
      this.container = state.containerInfo.currentContainer;
    }
    if (state.containerInfo && state.containerInfo.currentBox) {
      this.box = state.containerInfo.currentBox;
    }
  }
  ngOnChanges() {
    if (this.samplePK !== null && +this.samplePK > 0) {
      // get sample details from the server
      this.sample = this.findSample(+this.samplePK);
      console.log(this.sample);
      // could add sample relation here
      // if (!this.modal_initiated) {
      //   setTimeout(() => { this.modelService.open(new SampleDetailModalConfig(this.sample, this.modalSize)); this.modal_initiated = true });
      // }
    }
  }

  findSample(pk: number) {
    let sample: Sample = new Sample();
    if (pk != null) {
      const samples = this.box.samples.filter((s: Sample) => { return +pk === s.pk; });
      if (samples != null && samples.length === 1) { sample = samples[0]; }
    }
    return sample;
  }
}

// model settings
export class SampleDetailModalConfig extends ComponentModalConfig<Sample, void, void> {
  constructor(sample: Sample, size = ModalSize.Large) {
      super(SampleDetailModelComponent, sample);
      this.isClosable = true;
      this.transitionDuration = 200;
      this.size = size;
  }
}
