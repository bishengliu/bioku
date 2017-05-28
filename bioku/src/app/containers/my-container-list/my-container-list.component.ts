import { Component, OnInit, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Router} from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { LogAppStateService } from '../../_services/LogAppStateService';
import { ContainerService } from '../../_services/ContainerService';
import { Container } from '../../_classes/Container';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
import { REDUX_CONSTANTS as C } from '../../_redux/root/constants';
import { setMyContainersActionAsync, SetMyContainersAction, setMyContainersActionCreator, SetCurrentContainerAction, setCurrentContainerActionCreator } from '../../_redux/container/container_actions';

@Component({
  selector: 'app-my-container-list',
  templateUrl: './my-container-list.component.html',
  styleUrls: ['./my-container-list.component.css']
})
export class MyContainerListComponent implements OnInit {
  containers: Array<Container> = null;
  constructor(private alertService: AlertService, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, 
              private router: Router, private logAppStateService: LogAppStateService, private containerService: ContainerService)
  {
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();
  }
  updateState(){
    let state = this.appStore.getState();
    if (state.containerInfo && state.containerInfo.containers){
      this.containers = state.containerInfo.containers;
    }
  }
  displayContainerBoxes(container_pk: number){
    let currentContainer = this.containers.filter((c)=>c.pk===container_pk);
    if(currentContainer.length > 0){
      let setCurrentContainerAction : SetCurrentContainerAction = setCurrentContainerActionCreator(currentContainer);
      this.appStore.dispatch(setCurrentContainerAction);
      this.router.navigate(['/containers', container_pk]);
    }
  }

  ngOnInit() { 
    this.appStore.dispatch(setMyContainersActionAsync(this.containerService, this.alertService, this.logAppStateService));
  }
}
