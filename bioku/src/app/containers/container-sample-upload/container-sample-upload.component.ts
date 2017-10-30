import { Component, OnInit, OnDestroy, Inject, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting } from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { MoveSample } from '../../_classes/MoveSample';
import { ContainerService } from '../../_services/ContainerService';
import { AlertService } from '../../_services/AlertService';
import { UtilityService } from '../../_services/UtilityService';
import { LocalStorageService } from '../../_services/LocalStorageService';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';

@Component({
  selector: 'app-container-sample-upload',
  templateUrl: './container-sample-upload.component.html',
  styleUrls: ['./container-sample-upload.component.css']
})
export class ContainerSampleUploadComponent implements OnInit {
  id: number;
  private sub: any;
  container: Container;
  user: User;
  allowUpload: Boolean = false;
  load_failed: Boolean = false;
  loading: Boolean = true;
  constructor( @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
    private localStorageService: LocalStorageService, private containerService: ContainerService,
    private alertService: AlertService, private router: Router, private route: ActivatedRoute) {
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
    if (this.container != null && !this.container.has_box) {
      this.allowUpload = true;
    }
  }

  ngOnInit() {
    this.loading = true;
    this.load_failed = false;
    this.sub = this.route.params
    .mergeMap((params) => {
      this.id = +params['id'];
      if (this.container != null) {
        return Observable.of(this.container);
      } else {
        return this.containerService.containerDetail(this.id)
      }
    })
    .subscribe((container: any) => {
      this.container = container;
      this.loading = false;
      this.load_failed = false;
      },
      (err) => {
        this.loading = false;
        this.load_failed = true;
        this.alertService.error('Something went wrong, fail to load current container from the server!', true);
      });
  }
}
