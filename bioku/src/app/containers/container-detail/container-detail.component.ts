import { Component, OnInit, Inject, Input } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Container } from '../../_classes/Container';
import { User } from '../../_classes/User';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
import { concat } from 'rxjs/operator/concat';
@Component({
  selector: 'app-container-detail',
  templateUrl: './container-detail.component.html',
  styleUrls: ['./container-detail.component.css'],
})
export class ContainerDetailComponent implements OnInit {
  @Input() container: Container;
  @Input() displayMode: String = '';
  appUrl: string;
  isPIorAssist = false;
  user: User = null;
  totalCapacity: number;
  actualOccupation: number;
  percentageOccupation: number;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore) {
    this.appUrl = this.appSetting.URL;
    appStore.subscribe(() => this.updateState());
    this.updateState();
  }
  updateState() {
    const state = this.appStore.getState();
    // check pi
    if (state.authInfo && state.authInfo.authUser) {
      this.user = state.authInfo.authUser;
      if (this.user && this.user.roles) {
        this.user.roles.forEach( (r, i) => {
          if (r.toLowerCase() === 'pi') {
            this.isPIorAssist = true;
          }
        })
      }
    }
    // check authGroup
    if (state.authInfo && state.authInfo.authGroup) {
        const authGroups = state.authInfo.authGroup;
        authGroups.forEach( group => {
          if (group.assistants) {
            group.assistants.forEach( assist => {
              if (assist.user_id === this.user.pk) {
                this.isPIorAssist = true; }
            })
          }
        })
    }
  }
  ngOnInit() {
    if (this.container != null) {
      if (this.container.has_box && this.container.first_box) {
        const total_boxes = this.container.tower * this.container.shelf * this.container.box;
        const max_sample_per_box = this.container.first_box.box_vertical * this.container.first_box.box_horizontal;
        this.totalCapacity = total_boxes * max_sample_per_box;
        this.actualOccupation = this.container.sample_count;
        this.percentageOccupation = Math.ceil((this.actualOccupation / this.totalCapacity) * 100);
      }
    }
  }

}
