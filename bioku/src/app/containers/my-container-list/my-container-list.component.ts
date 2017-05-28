import { Component, OnInit, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Router} from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { LogAppStateService } from '../../_services/LogAppStateService';
import { ContainerService } from '../../_services/ContainerService';

//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
import { REDUX_CONSTANTS as C } from '../../_redux/root/constants';
import { setMyContainersActionAsync } from '../../_redux/container/container_actions';

@Component({
  selector: 'app-my-container-list',
  templateUrl: './my-container-list.component.html',
  styleUrls: ['./my-container-list.component.css']
})
export class MyContainerListComponent implements OnInit {
  appName: string;
  constructor(private alertService: AlertService, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, 
              private router: Router, private logAppStateService: LogAppStateService, private containerService: ContainerService)
  { 
    //app name
    this.appName = appSetting.NAME;
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();
  }

  updateState(){
    let state= this.appStore.getState()
  }

  ngOnInit() {  this.appStore.dispatch(setMyContainersActionAsync(this.containerService, this.alertService, this.logAppStateService)); }

}
