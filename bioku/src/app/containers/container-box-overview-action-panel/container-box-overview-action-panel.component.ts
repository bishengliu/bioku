import { Component, OnInit, Inject, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';
import { Container } from '../../_classes/Container';
import { Box } from '../../_classes/Box';
import { ContainerTower, Containershelf, BoxAvailability } from '../../_classes/ContainerTower';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import {  ContainerService } from '../../_services/ContainerService';
import { setCurrentContainerActionAsync, SetCurrentBoxAction, setCurrentBoxActionCreator, SetCurrentContainerAction, setCurrentContainerActionCreator } from '../../_redux/container/container_actions';
@Component({
  selector: 'app-container-box-overview-action-panel',
  templateUrl: './container-box-overview-action-panel.component.html',
  styleUrls: ['./container-box-overview-action-panel.component.css']
})
export class ContainerBoxOverviewActionPanelComponent implements OnInit {
  @Input() container: Container;
  @Input() selectedBoxes: Array<BoxAvailability>;
  _container: Container;
  _selectedBoxes: Array<BoxAvailability>;
  selectedBoxPositions: Array<string> = new Array<string>();
  action_panel_msg: string = "this is the panel error message!";
  selected_single_occupied_box: Box = new Box();
  //all container boxes;
  all_boxes: Array<Box> = new Array<Box>();
  //selected empty slots
  selectedEmptySlots: Array<BoxAvailability> = new Array<BoxAvailability>();
  //selected occupied slots
  selectedOccupiedSlots: Array<BoxAvailability> = new Array<BoxAvailability>();
  constructor(@Inject(AppStore) private appStore, private router: Router,private containerService: ContainerService) {
    appStore.subscribe(()=> this.updateState());
    this.updateState();
   }

   updateState(){
    let state = this.appStore.getState();
    if (state.containerInfo && state.containerInfo.currentContainer){
      this._container = state.containerInfo.currentContainer;
    }
  }
  //get all the selected box positions
  obtainBoxPostions(selectedBoxes: Array<BoxAvailability>): Array<string>{
    let positions: Array<string> = new Array<string>();
    if(selectedBoxes.length >0){
      selectedBoxes.forEach((b, i)=>{
        positions.push(b.full_position);
      });
    }  
    return positions
  }

  //get selected empty slots
  getSelectedEmptySlots(selectedBoxes: Array<BoxAvailability>): Array<BoxAvailability>{
    return selectedBoxes.filter((box, i)=>{return box.available == true;});
  }
  //get selected occupied slots
  getSelectedOccupiedSlots(selectedBoxes: Array<BoxAvailability>): Array<BoxAvailability>{
    return selectedBoxes.filter((box, i)=>{return box.available == false;});
  }

  retrieveBox(boxAvailability: BoxAvailability){
    if(this.all_boxes != null){
      let boxes = this.all_boxes.filter((b, i)=>{ return b.box_position == boxAvailability.full_position});
      if(boxes.length >0){ 
        this.selected_single_occupied_box = boxes[0]; 
      }
      else{
        this.selected_single_occupied_box = null;
      }
    }
  }

  //display the selected box
  displaySelectedBox(box: Box): void {
    this.router.navigate(['/containers', this._container.pk, box.box_position]);  
  }

  ngOnInit() {}
  ngOnChanges(change: SimpleChanges){
    if(change["container"] != undefined){
      this._container = this.container;
      this.containerService.containerGroupBoxes(this._container.pk)
      .subscribe((data: Array<Box>) =>{
        this.all_boxes = data;        
      }, ()=>{
        this.action_panel_msg= "fail to retrieve box details";
      });
    }
  }
  //performace not optimized/hit
  ngDoCheck(){   
    this._selectedBoxes = [...this.selectedBoxes];
    this.selectedBoxPositions = this.obtainBoxPostions(this._selectedBoxes);
    this.selectedEmptySlots = this.getSelectedEmptySlots(this._selectedBoxes);
    this.selectedOccupiedSlots = this.getSelectedOccupiedSlots(this._selectedBoxes);
    if(this.selectedOccupiedSlots.length ===1){
      this.retrieveBox(this.selectedOccupiedSlots[0]);
    }
    else{
      this.selected_single_occupied_box = null;
    }
  }

}
