import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { Container } from '../../_classes/Container';
import { Box, BoxFilter } from '../../_classes/Box';
import {  ContainerService } from '../../_services/ContainerService';
import { LogAppStateService } from '../../_services/LogAppStateService';

//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';
import { SetCurrentBoxAction, setCurrentBoxActionCreator, setCurrentBoxActionAsync } from '../../_redux/container/container_actions';
@Component({
  selector: 'app-container-box-list',
  templateUrl: './container-box-list.component.html',
  styleUrls: ['./container-box-list.component.css']
})
export class ContainerBoxListComponent implements OnInit, OnDestroy {
  //route param
  id: number;
  private sub: any; //subscribe to params observable
  container: Container = null;
  currentBox: Box = null;
  myBoxes: Array<Box> = [];
  searcherBoxes: Array<Box> = [];
  constructor(private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, 
              private router: Router, private containerService: ContainerService, private alertService: AlertService, private logAppStateService: LogAppStateService)
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
      this.currentBox = state.containerInfo.currentBox;
    }
  }
  updateBoxList(boxFilter:BoxFilter){
    //restore the complete boxes
    this.searcherBoxes = this.myBoxes;
    //filter the machted boxes
    this.searcherBoxes = this.myBoxes.filter((e: Box)=> {
        let isSelected = true;
        if(+boxFilter.tower != -1 && e.tower !== +boxFilter.tower){
          isSelected = false;
        }
        if(+boxFilter.shelf != -1 && e.shelf !== +boxFilter.shelf){
          isSelected = false;
        }
        if(+boxFilter.box != -1 && e.box !== +boxFilter.box){
          isSelected = false;
        }
        return isSelected;      
      }); 
  }
  displaySelectedBox(box: Box): void {
    let setCurrentBoxAction : SetCurrentBoxAction = setCurrentBoxActionCreator(this.container, box);
    this.appStore.dispatch(setCurrentBoxAction);
    this.router.navigate(['/containers', this.container.pk, box.box_position]);  
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
        this.myBoxes = data;
        this.searcherBoxes = data;
      },
      () => this.alertService.error('Something went wrong, fail to load boxes from the server!', true));
  }
  ngOnDestroy() { this.sub.unsubscribe(); }
}
