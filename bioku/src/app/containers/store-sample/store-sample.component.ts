import { Component, OnInit, Inject, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
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
  selector: 'app-store-sample',
  templateUrl: './store-sample.component.html',
  styleUrls: ['./store-sample.component.css']
})
export class StoreSampleComponent implements OnInit {
  ct_pk: number;
  box_pos: string;
  private sub: any; //subscribe to params observable
  emptySelectedCells: Array<string> = new Array<string>();
  cells: Array<string> = new Array<string>();
  container: Container = null;
  box: Box = null;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private localStorageService: LocalStorageService,
              private containerService: ContainerService, private alertService: AlertService, private router: Router, private route: ActivatedRoute) { 
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();
    this.emptySelectedCells = [...this.localStorageService.emptySelectedCells];
    this.cells = [...this.localStorageService.emptySelectedCells];
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
  toggleCell(slot: string){
    if(this.cells.indexOf(slot) === -1){
      this.cells = [...this.cells, slot];
    }
    else{
      this.cells = [...this.cells.filter((s: string)=>{return s.toLowerCase() !== slot.toLowerCase();})];
    }
  }
  cellIsExcluded(slot: string){
    return this.cells.indexOf(slot) === -1 ? true : false
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
      this.container = container;
      if(this.box != null && this.box.box_position == this.box_pos){
        return Observable.of(this.box);
      }else{
        return this.containerService.getContainerBox(this.ct_pk, this.box_pos);
      }
    })
    .subscribe((box: Box)=>{this.box=box}, (err)=>{
      console.log(err);
      this.alertService.error('Something went wrong!', true)
    });
  }
}
