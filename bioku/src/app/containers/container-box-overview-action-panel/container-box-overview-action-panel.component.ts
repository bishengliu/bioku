import { Component, OnInit, Inject, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';
import { Container } from '../../_classes/Container';
import { Box } from '../../_classes/Box';
import { MoveBox } from '../../_classes/MoveBox';
import { ContainerTower, Containershelf, BoxAvailability } from '../../_classes/ContainerTower';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import {  ContainerService } from '../../_services/ContainerService';
import {  AlertService } from '../../_services/AlertService';
import { LocalStorageService } from '../../_services/LocalStorageService';
import { setCurrentContainerActionAsync, SetCurrentBoxAction, setCurrentBoxActionCreator, SetCurrentContainerAction, setCurrentContainerActionCreator } from '../../_redux/container/container_actions';
@Component({
  selector: 'app-container-box-overview-action-panel',
  templateUrl: './container-box-overview-action-panel.component.html',
  styleUrls: ['./container-box-overview-action-panel.component.css']
})
export class ContainerBoxOverviewActionPanelComponent implements OnInit {
  @Input() container: Container;
  @Input() selectedBoxes: Array<BoxAvailability>;
  @Input() lastSelectedOccupiedBox: string;

  _container: Container;
  _selectedBoxes: Array<BoxAvailability>;
  selectedBoxPositions: Array<string> = new Array<string>();
  action_panel_msg: string = null;
  selected_single_occupied_box: Box = null;
  //all container boxes;
  all_boxes: Array<Box> = new Array<Box>();
  //selected empty slots
  selectedEmptySlots: Array<BoxAvailability> = new Array<BoxAvailability>();
  //selected occupied slots
  selectedOccupiedSlots: Array<BoxAvailability> = new Array<BoxAvailability>();
  //show panel content
  show_panel_content: boolean = true;
  constructor(@Inject(AppStore) private appStore, private router: Router,
              private containerService: ContainerService, private localStorageService: LocalStorageService, private alertService: AlertService) {
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
    let setCurrentBoxAction : SetCurrentBoxAction = setCurrentBoxActionCreator(this._container, box);
    this.appStore.dispatch(setCurrentBoxAction);
    this.router.navigate(['/containers', this._container.pk, box.box_position]);  
  }

  ngOnInit() {}

  ngOnChanges(change: SimpleChanges){
    if(change["container"] != undefined){
      this._container = this.container;     
    }
    if(change["lastSelectedOccupiedBox"] != undefined){
      if(this.lastSelectedOccupiedBox != null){
        this.containerService.getContainerBox(this._container.pk, this.lastSelectedOccupiedBox)
        .subscribe((data: Box) =>{
          this.selected_single_occupied_box = data; 
        }, ()=>{
          this.action_panel_msg= "fail to retrieve box details";
        });
      }
    }
    if(change["selectedBoxes"] != undefined){
      this._selectedBoxes = [...this.selectedBoxes];
      this.selectedBoxPositions = this.obtainBoxPostions(this._selectedBoxes);
      this.selectedEmptySlots = this.getSelectedEmptySlots(this._selectedBoxes);
      this.selectedOccupiedSlots = this.getSelectedOccupiedSlots(this._selectedBoxes);
    }
  }

  //add boxes
  addBox(){
    this.router.navigate(['/containers/overview/addbox', this._container.pk]);  
    this.localStorageService.boxAvailabilities = [];
    this.localStorageService.selectedEmptySlots = [];
    this.localStorageService.selectedOccupiedSlots = [];
    this.localStorageService.boxAvailabilities = [...this._selectedBoxes];
    this.localStorageService.selectedEmptySlots = [...this.selectedEmptySlots];
    this.localStorageService.selectedOccupiedSlots = [...this.selectedOccupiedSlots];
    this.localStorageService.lastSelectedOccupiedBox = this.lastSelectedOccupiedBox;
  }

  //moveBox
  moveBox(){
    this.router.navigate(['containers/overview/movebox', this._container.pk]);  
    this.localStorageService.boxAvailabilities = [];
    this.localStorageService.selectedEmptySlots = [];
    this.localStorageService.selectedOccupiedSlots = [];
    this.localStorageService.boxAvailabilities = [...this._selectedBoxes];
    this.localStorageService.selectedEmptySlots = [...this.selectedEmptySlots];
    this.localStorageService.selectedOccupiedSlots = [...this.selectedOccupiedSlots];
    this.localStorageService.lastSelectedOccupiedBox = this.lastSelectedOccupiedBox;
  }

  //switch box
  switchBox(){
    //validate only 2 occupied box selected
    if(this.selectedOccupiedSlots.length === 2){
      //generate switch boxes
      let swtich_box: MoveBox = new MoveBox();
      swtich_box.box_full_position = this.selectedOccupiedSlots[0].full_position;
      swtich_box.original_container = this.container.pk;
      swtich_box.target_box_full_position = this.selectedOccupiedSlots[1].full_position;
      swtich_box.target_container = this.container.pk;
      this.containerService.moveContainerBoxes(swtich_box.original_container, swtich_box.box_full_position, swtich_box.target_container, swtich_box.target_box_full_position)
      .subscribe(()=>{
        this.alertService.success("Boxes are swtiched successfully!", true);       
      }, 
      (err)=>{
        this.alertService.error("Something went wrong, failed to switch boxes!", true);
        console.log(err);
      });
    }
    else{
      this.alertService.error("Boxes not switched, please make sure you only selected 2 occuped boxes!", true);
    }
    console.log(this.selectedOccupiedSlots);
  }
  
  hidePanelContent(){
    this.show_panel_content = false;
  }

  showPanelContent(){
    this.show_panel_content = true;
  }
}
