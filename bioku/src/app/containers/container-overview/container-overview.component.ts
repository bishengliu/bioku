import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { Box } from '../../_classes/Box';
import { ContainerTower, Containershelf, BoxAvailability } from '../../_classes/ContainerTower';
import {  ContainerService } from '../../_services/ContainerService';
import { SuiModule} from 'ng2-semantic-ui';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';
import { SetCurrentContainerAction, setCurrentContainerActionCreator } from '../../_redux/container/container_actions';

@Component({
  selector: 'app-container-overview',
  templateUrl: './container-overview.component.html',
  styleUrls: ['./container-overview.component.css']
})
export class ContainerOverviewComponent implements OnInit, OnDestroy {
  //auth user
  user: User = null;
  token: string = null;

  //route param
  id: number;
  private sub: any; //subscribe to params observable

  //CURRENT CONTAINER
  container: Container;
  //current boxes
  occupied_boxes: Array<Box> = [];
  //occupied box positions
  occupied_postions: Array<string> = [];
  //available positions
  containerTowers: Array<ContainerTower> = [];

  //selected boxes
  selectedBoxes: Array<BoxAvailability> = new Array<BoxAvailability>();
  //last selected occupied box
  lastSelectedOccupiedBox: string = null;

  constructor(private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, 
              private router: Router, private http: Http, private containerService: ContainerService,)
   { 
     appStore.subscribe(()=> this.updateState());
     this.updateState();
   }
   updateState(){
    let state= this.appStore.getState()

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
    let container$ = this.sub
    .map((container: Container) => { this.container = container; return container;})
    .mergeMap((container: Container)=>{
      //get all the boxes in the current container
      return this.containerService.containerAllBoxes(container.pk);
    });

    //all the boxes in the current container
    container$.subscribe((boxes: Array<Box>)=>{
      this.occupied_boxes = boxes; //all occupied boxes
      //get curent occupied positions
      this.occupied_postions = this.getContainerBoxOccupiedPositions(this.occupied_boxes);
      //generate current free positions
      this.containerTowers = this.getContainerBoxAvailablity(this.container, this.occupied_postions);
      //console.log(this.containerTowers);
    },
    (err)=>{console.log(err)});
  }

  //method to get curent occupied positions
  getContainerBoxOccupiedPositions(occupied_boxes: Array<Box>): Array<string>{
    let occupied_postions: Array<string> = [];
    occupied_boxes.forEach(box => {
      if(occupied_postions.indexOf(box.box_position) === -1){
        occupied_postions.push(box.box_position);} 
    });
    return occupied_postions;
  }
  //method generate current free positions
  getContainerBoxAvailablity(container: Container, occupied_postions: Array<string>): Array<ContainerTower> {
    let containerTowers: Array<ContainerTower> = [];
    //loop the container towers
    for(let t=0; t< container.tower; t++){
      let containerTower = new ContainerTower();
      containerTower.tower = (t + 1);
      //get the shelves
      let containershelves: Array<Containershelf> = [];
      //loop shelves
      for(let s=0; s < container.shelf; s++){
        let containershelf = new Containershelf();
        containershelf.shelf = (s + 1);
        //box availablity
        let boxAvailabilities : Array<BoxAvailability> = [];
        //loop box
        for(let b=0; b< container.box; b++){
          let boxAvailability = new BoxAvailability();
          boxAvailability.position = (b+1);         
          //current position
          let current_box_pos: string = (t+1)+'-'+(s+1)+'-'+(b+1);
          boxAvailability.full_position = current_box_pos;
          occupied_postions.indexOf(current_box_pos) === -1? boxAvailability.available = true: boxAvailability.available = false;
          boxAvailabilities.push(boxAvailability);
        }
        containershelf.boxAvailabilities = boxAvailabilities;
        containershelves.push(containershelf);        
      }
      containerTower.shelves = containershelves;
      containerTowers.push(containerTower);
    }
    return containerTowers;
  }
  //capture child event emited
  captureBoxesSelected(boxes: Array<BoxAvailability>){
    this.selectedBoxes = boxes;
  }
  //capture last selected occupied box
  captureLastSelectedBox(position: string){
    this.lastSelectedOccupiedBox = position;
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
