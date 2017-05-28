import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { Container } from '../../_classes/Container';
import { Box } from '../../_classes/Box';
import {  ContainerService } from '../../_services/ContainerService';

//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';
@Component({
  selector: 'app-container-box-list',
  templateUrl: './container-box-list.component.html',
  styleUrls: ['./container-box-list.component.css']
})
export class ContainerBoxListComponent implements OnInit {
  //route param
  id: number;
  private sub: any; //subscribe to params observable
  container: Container = null;
  myBoxes: Array<Box> = []
  constructor(private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, 
              private router: Router, private containerService: ContainerService, private alertService: AlertService,)
  { 
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();
  }
  updateState(){
    let state = this.appStore.getState();
    if (state.containerInfo && state.containerInfo.currentContainer){
      this.container = state.containerInfo.currentContainer;
    }
  }

  ngOnInit() {
    this.sub = this.route.params
      .mergeMap((params) =>{
        this.id = +params['id'];
        if(this.container != null){
          return Observable.of(this.container);
        }else{
          return this.containerService.containerDetail(this.id)
        }
      })
      .mergeMap((container: any)=>{
        this.container = container;
        //get group boxes of the container
        return this.containerService.containerGroupBoxes(this.id)
      })
      .subscribe((data: any)=>{
        console.log(data)
        this.myBoxes = data;
      },
      () => this.alertService.error('Something went wrong, fail to load boxes from the server!', true));
  }
  ngOnDestroy() { this.sub.unsubscribe(); }
}
