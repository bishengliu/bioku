import { Component, OnInit, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Router} from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { LogAppStateService } from '../../_services/LogAppStateService';
import { ContainerService } from '../../_services/ContainerService';
import { Container } from '../../_classes/Container';
import { RefreshService } from '../../_services/RefreshService';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
import { REDUX_CONSTANTS as C } from '../../_redux/root/constants';
import { setMyContainersActionAsync, SetMyContainersAction, setMyContainersActionCreator, SetCurrentContainerAction, setCurrentContainerActionCreator, setCurrentContainerActionAsync } from '../../_redux/container/container_actions';

@Component({
  selector: 'app-my-container-list',
  templateUrl: './my-container-list.component.html',
  styleUrls: ['./my-container-list.component.css']
})
export class MyContainerListComponent implements OnInit {
  loading: boolean = true;
  load_failed: boolean = false;
  containers: Array<Container> = null;
  constructor(private alertService: AlertService, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private refreshService: RefreshService,
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
      if(this.containers.length > 0){
        this.loading = false;
      }
    }
  }

  displayContainerBoxes(container_pk: number){
    let currentContainers = this.containers.filter((c)=>c.pk===container_pk);
    if(currentContainers.length > 0){
      //dispatch the selected container and dump data to local storage
      this.appStore.dispatch(setCurrentContainerActionAsync(currentContainers[0], this.refreshService));
      this.router.navigate(['/containers', container_pk]); 
    }
    else{
      this.alertService.error("Container not found!", true);
    }
  }

  ngOnInit() {
    //everything retrieve the container list from the server
    this.appStore.dispatch(setMyContainersActionAsync(this.containerService, this.alertService, this.logAppStateService, this.refreshService));
  }
}
