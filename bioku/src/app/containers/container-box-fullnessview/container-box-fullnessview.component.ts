import { Component, OnInit, Inject, Input } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { ContainerService } from '../../_services/ContainerService';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';

@Component({
  selector: 'app-container-box-fullnessview',
  templateUrl: './container-box-fullnessview.component.html',
  styleUrls: ['./container-box-fullnessview.component.css']
})
export class ContainerBoxFullnessviewComponent implements OnInit {
  @Input() box: Box;
  // tslint:disable-next-line:no-inferrable-types
  rate: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  color: string = '#ffffff';
  user: User;
  appUrl: string;
  container: Container = null;
  // tslint:disable-next-line:no-inferrable-types
  currentSampleCount: number = 0;
  boxCapacity = 1;
  // show user defined box label?
  show_user_defined_label: Boolean = false;

  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
              private containerService: ContainerService) {
    this.appUrl = this.appSetting.URL;
    this.show_user_defined_label = this.appSetting.SHOW_BOX_LABEL;
    // subscribe store state changes
    appStore.subscribe(() => this.updateState());
    this.updateState();
   }
   updateState() {
    const state = this.appStore.getState();
    if (state.authInfo && state.authInfo.authUser) {
      this.user = state.authInfo.authUser;
    }
    if (state.containerInfo && state.containerInfo.currentContainer) {
      this.container = state.containerInfo.currentContainer;
    }
  }
  updateRate(rate: number, box_position: string) {
    this.rate = rate;
    if (this.container !== null) {
      this.containerService.updateBoxRate(this.container.pk, box_position, rate)
      .subscribe(() => {}, (err) => console.log(err));
    }
  }
  clearRate(box_position: string) {
    if (this.container !== null) {
      this.containerService.updateBoxRate(this.container.pk, box_position, 0)
      .subscribe(() => this.rate = 0, (err) => console.log(err));
    }
  }
  ngOnInit() {
    this.rate =  this.box.rate == null ? 0 : this.box.rate;
    this.color = this.box.color == null ? '#ffffff' : this.box.color;
    this.currentSampleCount = this.box.sample_count;
    this.boxCapacity = this.box.box_horizontal * this.box.box_vertical;
  }
}
