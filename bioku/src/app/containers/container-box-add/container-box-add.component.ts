import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { User } from '../../_classes/User';
import { Box } from '../../_classes/Box';
import { AddBox } from '../../_classes/AddBox';
import { Container } from '../../_classes/Container';
import { ContainerTower, Containershelf, BoxAvailability } from '../../_classes/ContainerTower';
import {  ContainerService } from '../../_services/ContainerService';
import { LocalStorageService } from '../../_services/LocalStorageService';
import { UtilityService } from '../../_services/UtilityService';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';

@Component({
  selector: 'app-container-box-add',
  templateUrl: './container-box-add.component.html',
  styleUrls: ['./container-box-add.component.css']
})
export class ContainerBoxAddComponent implements OnInit, OnDestroy {
  //auth user
  user: User = null;
  token: string = null;
  //route param
  id: number;
  private sub: any; //subscribe to params observable
  //CURRENT CONTAINER
  container: Container;
  boxes: Array<BoxAvailability> = new Array<BoxAvailability>();
  add_boxes: Array<AddBox> = new Array<AddBox>();
  box_horizontal: number;
  box_vertical: number;
  
  constructor(private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private utilityService: UtilityService,
              private router: Router, private http: Http, private containerService: ContainerService, private localStorageService: LocalStorageService)
  { 
    appStore.subscribe(()=> this.updateState());
    this.updateState();
    //SET THE DEFAULT BOX LAYOUT
    this.box_horizontal = this.appSetting.box_horizontal;
    this.box_vertical = this.appSetting.box_vertical;
  }
  updateState(){
    let state= this.appStore.getState();
    //set auth user
    if(state.authInfo){
    this.user = state.authInfo.authUser;
    this.token = state.authInfo.token.token;
    }
    //get current container
    if (state.containerInfo && state.containerInfo.currentContainer){
    this.container = state.containerInfo.currentContainer;
    }
  }

  ngOnInit() {
    this.sub = this.route.params
    .mergeMap((params) =>{
      this.id = +params['id'];
      if( this.container != null && this.container.pk === this.id){
        return Observable.of(this.container);}
      else{
        return this.containerService.containerDetail(this.id);}
    });
    //container and boxes observable
    this.sub.subscribe(
      (container: Container)=> { this.container = container; }, 
      (err)=>{console.log(err)}
    );
    this.boxes = this.localStorageService.selectedEmptySlots.sort(this.utilityService.sortArrayBySingleProperty('full_position'));;
    //generate add_boxes
    this.boxes.forEach((ab, i)=>{
      let add_box: AddBox = new AddBox();
      add_box.box_full_position = ab.full_position;
      add_box.is_excluded = false;
      this.add_boxes.push(add_box);
    });
    //get the first box
    this.box_horizontal = (this.container.boxes != null && this.container.boxes.length > 0) ? this.container.boxes[0].box_horizontal : this.box_horizontal;
    this.box_vertical = (this.container.boxes != null && this.container.boxes.length > 0) ? this.container.boxes[0].box_vertical : this.box_vertical;
  }
  ngOnDestroy() { this.sub.unsubscribe(); }
}
