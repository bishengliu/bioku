import { Component, OnInit, Inject, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { ContainerService } from '../../_services/ContainerService';
import {  AlertService } from '../../_services/AlertService';
import {  LocalStorageService } from '../../_services/LocalStorageService';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
@Component({
  selector: 'app-move-sample',
  templateUrl: './move-sample.component.html',
  styleUrls: ['./move-sample.component.css']
})
export class MoveSampleComponent implements OnInit {
  moving: boolean = false;
  user: User;
  appUrl: string;
  container: Container = null;
  box: Box = null;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private localStorageService: LocalStorageService,
              private containerService: ContainerService, private alertService: AlertService, private router: Router, private route: ActivatedRoute) { 
    this.appUrl = this.appSetting.URL;
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();
  }
  updateState(){
    let state = this.appStore.getState();
    if (state.authInfo && state.authInfo.authUser){
      this.user = state.authInfo.authUser;
    }
    if (state.containerInfo && state.containerInfo.currentContainer){
      this.container = state.containerInfo.currentContainer;
    }
    if (state.containerInfo && state.containerInfo.currentBox){
      this.box = state.containerInfo.currentBox;
    }
  }

  ngOnInit() {
  }

}
