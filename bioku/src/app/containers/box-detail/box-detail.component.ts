import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { Container } from '../../_classes/Container';
import { Box, BoxFilter } from '../../_classes/Box';
import {  ContainerService } from '../../_services/ContainerService';

//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';
import { SetCurrentBoxAction, setCurrentBoxActionCreator } from '../../_redux/container/container_actions';

@Component({
  selector: 'app-box-detail',
  templateUrl: './box-detail.component.html',
  styleUrls: ['./box-detail.component.css']
})
export class BoxDetailComponent implements OnInit, OnDestroy {

  //route param
  ct_pk: number;
  box_pos: string;
  private sub: any; //subscribe to params observable
  container: Container = null;
  box: Box = null;

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
    if (state.containerInfo && state.containerInfo.currentBox){
      this.box = state.containerInfo.currentBox;
    }
  }
  ngOnInit() {
    this.sub = this.route.params
      .mergeMap((params) =>{
        this.ct_pk = +params['ct_pk'];
        this.box_pos = params['box_pos'];
        if(this.container != null){
          return Observable.of(this.container);
        }else{
          return this.containerService.containerDetail(this.ct_pk)
        }
      })
      .mergeMap((container: any)=>{
        //set the container
        this.container = container;

        if(this.box != null){
            return Observable.of(this.box);}
        else{
          //get group boxes of the container
          return this.containerService.getContainerBox(this.ct_pk, this.box_pos);}        
      })
      .subscribe((box: Box)=>{
        this.box = box;
    },        
      () => this.alertService.error('Something went wrong, fail to load boxes from the server!', true));
  }
  ngOnDestroy() { this.sub.unsubscribe(); }

}
