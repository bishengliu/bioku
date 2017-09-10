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
import {  UtilityService } from '../../_services/UtilityService';
import {  LocalStorageService } from '../../_services/LocalStorageService';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
//dragula
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
  secondConatiner: Container = null;
  secondBox: Box = null;
  secondBoxSamples: Array<Sample> = new Array<Sample>();
  secondColor: string = "#ffffff"; //box color
  //box hArray and vArray
  secondHArray: Array<number> = [];
  secondVArray:Array<string> = [];
  //dragular driective options
  private dragulaDrop$: any
  dragulaOptions: any = {
    revertOnSpill: true
  }
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private localStorageService: LocalStorageService, 
              private utilityService: UtilityService,private containerService: ContainerService, private alertService: AlertService, private router: Router, 
              private route: ActivatedRoute, private dragulaService: DragulaService) 
  { 
    this.appUrl = this.appSetting.URL;
    this.box_letters = this.appSetting.BOX_POSITION_LETTERS;
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
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
    //this.router.navigate(['/containers', this.container.pk], { queryParams: { 'box_position': this.firstBox.box_position } });  
  }
  selectContainer(event: any){
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let target_container_pk = this.parseContainerSelectionVale(target.value);
    if(target_container_pk != null){
      let filtered_containers = this.my_containers.filter((c, i)=>{return c.pk === target_container_pk});
      if(filtered_containers.length >0){
        this.secondConatiner = filtered_containers[0];
      }
      else{
        this.secondConatiner = this.container;
      }
    }
    //get the second container box

    //
  }
  updateTarget(container_pk: any, type: string, event: any){
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let val: number = +target.value;
    console.log(val);
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
        //find only one box
        return this.containerService.getContainerBox(+params['second_container'], params['second_box_position']);
      }
      else{
        this.secondConatiner = this.container;
        //get group boxes of the container
        return Observable.of(null);
      }
    })
    .subscribe((second_box: any)=>{
      if(second_box != null){
        this.secondBox = second_box;
        this.secondBoxSamples = [...this.secondBox.samples];
        this.secondColor = this.secondBox.color == null ? "#ffffff" : this.secondBox.color;        
      }
      
      if(this.firstBox != null){ 
        this.firstBoxSamples = [...this.firstBox.samples];
        this.firstColor = this.firstBox.color == null ? "#ffffff" : this.firstBox.color;
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
      console.log([source_slot, target_slot]);
      this.onDrop(source_slot, target_slot);
    });
  }
  private onDrop(source_slot: string, target_slot: string) {

  }
  ngOnDestroy() { 
    if(this.dragulaDrop$ != undefined){
      this.dragulaDrop$.unsubscribe();
    }
  }
}
