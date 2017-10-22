import { Component, OnInit, Inject, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { MoveSample } from '../../_classes/MoveSample';
import { ContainerService } from '../../_services/ContainerService';
import {  AlertService } from '../../_services/AlertService';
import {  UtilityService } from '../../_services/UtilityService';
import {  LocalStorageService } from '../../_services/LocalStorageService';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
// dragula
import { DragulaService } from 'ng2-dragula/ng2-dragula';
@Component({
  selector: 'app-move-sample',
  templateUrl: './move-sample.component.html',
  styleUrls: ['./move-sample.component.css']
})
export class MoveSampleComponent implements OnInit {
  ct_pk: number;
  box_pos: string;
  private sub: any; //subscribe to params observable
  private querySub: any;

  //all my group containers
  my_containers: Array<Container> = new Array<Container>();

  moving: boolean = false;
  user: User;
  appUrl: string;
  container: Container = null;
  loading: boolean = true;
  //Box position letters
  box_letters: Array<string> = [];
  //first box
  firstBox: Box = null;
  firstBoxSamples: Array<Sample> = new Array<Sample>();
  firstColor: string = "#ffffff"; //box color
  //box hArray and vArray
  firstHArray: Array<number> = [];
  firstVArray:Array<string> = [];
  //second box and container
  secondContainer: Container = null;
  secondBox: Box = null;
  secondBoxSamples: Array<Sample> = new Array<Sample>();
  secondColor: string = "#ffffff"; //box color
  //box hArray and vArray
  secondHArray: Array<number> = [];
  secondVArray:Array<string> = [];
  //second box
  secondBoxTower: number = null;
  secondBoxShelf: number = null;
  secondBoxBox: number = null;
  loading_box2: boolean = false;
  box2_not_found: boolean = false;
  //show user defined box label?
  show_user_defined_label: boolean = false;
  //dragular driective options
  private dragulaDrop$: any
  dragulaOptions: any = {
    revertOnSpill: true
  }
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private localStorageService: LocalStorageService, 
              private utilityService: UtilityService,private containerService: ContainerService, private alertService: AlertService, private router: Router, 
              private route: ActivatedRoute, private dragulaService: DragulaService, ) 
  { 
    this.appUrl = this.appSetting.URL;
    this.show_user_defined_label = this.appSetting.SHOW_BOX_LABEL;
    this.box_letters = this.appSetting.BOX_POSITION_LETTERS;
    //subscribe store state changes
    appStore.subscribe(() => this.updateState());
    this.updateState();
  }

  updateState(){
    let state = this.appStore.getState();
    if (state.authInfo && state.authInfo.authUser){
      this.user = state.authInfo.authUser;
    }
    if (state.containerInfo && state.containerInfo.currentContainer){
      this.container = state.containerInfo.currentContainer;
    }
    if (state.containerInfo && state.containerInfo.currentBox){
      this.firstBox = state.containerInfo.currentBox;
      this.firstHArray = this.utilityService.genArray(this.firstBox.box_horizontal);
      this.firstVArray = this.genLetterArray(this.firstBox.box_vertical);
    }
    //get all my contaoners
    if (state.containerInfo && state.containerInfo.containers){
      this.my_containers = state.containerInfo.containers;
    }
  }

  genLetterArray(num:number){
    return this.box_letters.slice(0, num);
  }

  genBorderStyle(color: string){
    let cssValue: string = "1px solid rgba(34,36,38,.15)";
    if(color != null){
      cssValue = "3px solid " + color;
    }
    return cssValue;
  }

  pickerSamples(h: number, v: string, current_box: boolean){
    if(current_box){
      return this.firstBoxSamples.filter((s:Sample)=> s.occupied==true && s.position.toLowerCase()===(v+h).toLowerCase())
    }
    else{
      return this.secondBoxSamples.filter((s:Sample)=> s.occupied==true && s.position.toLowerCase()===(v+h).toLowerCase())
    }
  }

  forceRefresh(){
    this.router.navigate(['/containers', this.container.pk, this.firstBox.box_position], { queryParams: { 'second_container': this.secondContainer.pk, 'second_box_position': this.secondBox.box_position } });  
  }
  
  selectContainer(event: any){
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let target_container_pk = this.parseContainerSelectionVale(target.value);
    this.secondContainer = this.getSecondContainer(target_container_pk);
  }

  updateTarget(container_pk: any, type: string, event: any){
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let val: number = +target.value;
    if(type=="target_tower" && !isNaN(+val)){
      this.secondBoxTower = +val;
    }
    if(type=="target_shelf" && !isNaN(+val)){
      this.secondBoxShelf = +val;
    }
    if(type=="target_box" && !isNaN(+val)){
      this.secondBoxBox = +val;
    }
    if(this.secondBoxTower != null && this.secondBoxTower >0 && this.secondBoxShelf != null && this.secondBoxShelf > 0 && this.secondBoxBox != null && this.secondBoxBox >0){
      //box 2
      this.box2_not_found = false;
      //second box positon
      let second_box_position = this.secondBoxTower + '-' + this.secondBoxShelf + '-' + this.secondBoxBox;
      //load second box
      this.loading_box2 = true;
      this.containerService.getContainerBox(this.secondContainer.pk, second_box_position)
      .subscribe((box: Box)=>{
        this.secondBox = box;
        this.secondBoxSamples = [...this.secondBox.samples];
        this.secondColor = this.secondBox.color == null ? "#ffffff" : this.secondBox.color;   
        this.secondHArray = this.utilityService.genArray(this.secondBox.box_horizontal);
        this.secondVArray = this.genLetterArray(this.secondBox.box_vertical);
        this.loading_box2 = false;
      }, (err)=>{
        console.log(err);
        this.alertService.error("fail to load the second box!", true);
        this.box2_not_found = true;
        this.loading_box2 = false;
      });
    }
  }

  //update tower-shelf-box dropdown
  genOptions(container_pk: number, type: string): Array<number>{
    let my_container = this.my_containers.filter((c, i)=>{
      return c.pk === container_pk;
    })
    if(my_container.length == 0){
      return [];
    }
    return this.utilityService.genArray(my_container[0][type])
  }

  parseContainerSelectionVale(target_value: string){
    let array: Array<string> = target_value.split(': ');
    let val = array.length ==2 ? +array[1] : null;
    return val;
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
      //first box
      return this.containerService.getContainerBox(this.ct_pk, this.box_pos);        
    })
    .mergeMap((box: any)=>{
      this.firstBox = box;
      this.querySub = this.route.queryParams
      return this.querySub;
    })
    .mergeMap((params)=>{
      if(params && params['second_container'] != undefined && params['second_box_position'] != undefined){
        //set the second container
        this.secondContainer = this.getSecondContainer(+params['second_container']);
        //find only one box    
        return this.containerService.getContainerBox(+params['second_container'], params['second_box_position']);
      }
      else{
        this.secondContainer = this.container;
        //get group boxes of the container
        return Observable.of(this.firstBox);
      }
    })
    .subscribe((second_box: any)=>{
      if(second_box != null){
        this.secondBox = second_box;
        this.secondBoxSamples = [...this.secondBox.samples];
        this.secondColor = this.secondBox.color == null ? "#ffffff" : this.secondBox.color;
        this.secondHArray = this.utilityService.genArray(this.secondBox.box_horizontal);
        this.secondVArray = this.genLetterArray(this.secondBox.box_vertical);
        this.secondBoxTower = this.secondBox.tower;
        this.secondBoxShelf = this.secondBox.shelf;
        this.secondBoxBox = this.secondBox.box;    
      }
      
      if(this.firstBox != null){ 
        this.firstBoxSamples = [...this.firstBox.samples];
        this.firstColor = this.firstBox.color == null ? "#ffffff" : this.firstBox.color;
        this.firstHArray = this.utilityService.genArray(this.firstBox.box_horizontal);
        this.firstVArray = this.genLetterArray(this.firstBox.box_vertical);
      }
      this.loading = false;
      }, 
      (err)=>{
        console.log(err);
        this.alertService.error('Something went wrong, fail to load boxes from the server!', true)
      });

    //dragular
    this.dragulaDrop$ = this.dragulaService.drop.subscribe((value) => {
      //console.log(`drop: ${value[1]}`);
      //el, target, source, sibling
      let source_slot = value[3].attributes["position"].value;
      let target_slot = value[2].attributes["position"].value;
      //console.log([source_slot, target_slot]);
      this.onDrop(source_slot, target_slot);
    });
  }

  //get the second container
  getSecondContainer(pk: number){
    let container: Container = new Container();
    if(pk != null){
      let filtered_containers = this.my_containers.filter((c, i)=>{return c.pk === pk});
      if(filtered_containers.length >0){
        container = filtered_containers[0];
      }
      else{
        container = this.container;
      }
    }
    return container;
  }

  private onDrop(source_slot: string, target_slot: string) {
    if(source_slot != null && target_slot != null){
      let moveSample: MoveSample = this.parseDropSlot(source_slot, target_slot);
      //save to database
      this.containerService.switchSample2Boxes(moveSample)
      .subscribe(()=>{
        //this.alertService.success('Sample positon updated!', true);
        this.forceRefresh();
      }, ()=>{
        this.alertService.error('Something went wrong, fail to move/switch samples!', true);
        this.forceRefresh();
      });
      
    }
  }
  
  parseDropSlot(source_slot: string, target_slot: string): MoveSample {
    let obj: MoveSample = new MoveSample();;

    //source
    let farray = source_slot.split('|');
    let fcontainer_pk = +farray[0];
    obj.first_container_pk = fcontainer_pk;

    let fbp_array = farray[1].split('-');
    obj.first_box_tower = +fbp_array[0];
    obj.first_box_shelf = +fbp_array[1];
    obj.first_box_box = +fbp_array[2];

    let fsp_array = farray[2].split('-');
    obj.first_sample_vposition = fsp_array[0];
    obj.first_sample_hposition = +fsp_array[1];

    //target
    let sarray = target_slot.split('|');
    let scontainer_pk = +sarray[0];
    obj.second_container_pk = scontainer_pk;

    let sbp_array = sarray[1].split('-');
    obj.second_box_tower = +sbp_array[0];
    obj.second_box_shelf = +sbp_array[1];
    obj.second_box_box = +sbp_array[2];

    let ssp_array = sarray[2].split('-');
    obj.second_sample_vposition = ssp_array[0];
    obj.second_sample_hposition = +ssp_array[1];
    return obj;
  }

  ngOnDestroy() { 
    if(this.dragulaDrop$ != undefined){
      this.dragulaDrop$.unsubscribe();
    }
  }
}