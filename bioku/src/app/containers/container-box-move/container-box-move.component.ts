import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { User } from '../../_classes/User';
import { Box } from '../../_classes/Box';
import { MoveBox } from '../../_classes/MoveBox';
import { Container } from '../../_classes/Container';
import { ContainerTower, Containershelf, BoxAvailability } from '../../_classes/ContainerTower';
import { ContainerService } from '../../_services/ContainerService';
import { LocalStorageService } from '../../_services/LocalStorageService';
import {  UtilityService } from '../../_services/UtilityService';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';

@Component({
  selector: 'app-container-box-move',
  templateUrl: './container-box-move.component.html',
  styleUrls: ['./container-box-move.component.css']
})
export class ContainerBoxMoveComponent implements OnInit, OnDestroy {
  //auth user
  user: User = null;
  token: string = null;
  appUrl: string = null;
  //route param
  id: number;
  private sub: any; //subscribe to params observable
  //CURRENT CONTAINER
  container: Container;
  //boxes passed
  boxes: Array<BoxAvailability> = new Array<BoxAvailability>();
  //all my group containers
  my_containers: Array<Container> = new Array<Container>();
  //data holding the moving info
  move_boxes: Array<MoveBox> = new Array<MoveBox>();
  constructor(private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private utilityService: UtilityService,
              private router: Router, private http: Http, private containerService: ContainerService, private localStorageService: LocalStorageService)
  { 
    this.appUrl = this.appSetting.URL;
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
    //get all my contaoners
    if (state.containerInfo && state.containerInfo.containers){
      this.my_containers = state.containerInfo.containers;
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
    let containers$ = this.sub
    .map((container: Container) => { this.container = container; })
    .mergeMap(()=>{
      //get all my group containers
      if( this.my_containers != null){
        return Observable.of(this.my_containers);}
      else{
        return this.containerService.myContainers();
      }     
    });
    //container and boxes observable
    containers$.subscribe(
      (containers: Array<Container>)=> { this.my_containers = containers; }, 
      (err)=>{console.log(err)}
    );

    //get the passed boxes
    this.boxes = this.localStorageService.selectedOccupiedSlots;
    //proce the moving object, default move to current container
    if(this.boxes.length >0){
      this.boxes.forEach((box, i)=>{
        let move_box: MoveBox = new MoveBox();
        move_box.original_container = this.container.pk;
        move_box.box_full_position = box.full_position;
        move_box.target_container = this.container.pk;
        move_box.target_tower = null;
        move_box.target_shelf = null;
        move_box.target_box = null;
        this.move_boxes.push(move_box);
      });
    }
    //get the 
  }

  selectContainer(box_full_position: string, event: any){
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    // console.log(eventObj);
    // console.log(target);
    // //id
    // console.log(target.id);
    // //value
    // console.log(target.value);

    //modify the moving object
    let all_box_positions:Array<string> = this.obtainBoxPostions(this.boxes);
    //get the index
    let box_index: number = all_box_positions.indexOf(box_full_position);
    if(box_index != -1){
      //set the target container
      let target_container_pk = this.parseContainerSelectionVale(target.value);
      if(target_container_pk != null){
        this.move_boxes[box_index].target_container = target_container_pk;
      }     
    }
  }

  //update tower-shelf-box dropdown
  genOptions(box_full_position: string, type: string): Array<number>{
    //get the target container
    let target_container = this.move_boxes.filter((m, i)=>{ 
      return m.box_full_position == box_full_position;
    });
    if(target_container.length ==  0){
      return [];
    }
    else{
      let my_container = this.my_containers.filter((c, i)=>{
        return c.pk == target_container[0].target_container;
      })
      if(my_container.length == 0){
        return [];
      }
      return this.utilityService.genArray(my_container[0][type])
    }
  }

  updateTarget(box_full_position: string, type: string, event: any): void{
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let val: number = +target.value;
    //modify the moving object
    let all_box_positions:Array<string> = this.obtainBoxPostions(this.boxes);
    //get the index
    let box_index: number = all_box_positions.indexOf(box_full_position);
    if(box_index != -1){
      this.move_boxes[box_index][type] = val;
    }
  }

  obtainBoxPostions(selectedBoxes: Array<BoxAvailability>): Array<string>{
    let positions: Array<string> = new Array<string>();
    if(selectedBoxes.length >0){
      selectedBoxes.forEach((b, i)=>{
        positions.push(b.full_position);
      });
    }  
    return positions
  }

  parseContainerSelectionVale(target_value: string){
    let array: Array<string> = target_value.split(': ');
    let val = array.length ==2 ? +array[1] : null;
    return val;
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

}
