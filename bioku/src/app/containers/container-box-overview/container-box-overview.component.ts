import { Component, OnInit, Inject, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { Container } from '../../_classes/Container';
import { Box } from '../../_classes/Box';
import {  UtilityService } from '../../_services/UtilityService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import {  ContainerService } from '../../_services/ContainerService';
import { ContainerTower, Containershelf, BoxAvailability } from '../../_classes/ContainerTower';

@Component({
  selector: 'app-container-box-overview',
  templateUrl: './container-box-overview.component.html',
  styleUrls: ['./container-box-overview.component.css']
})
export class ContainerBoxOverviewComponent implements OnInit {
  @Input() container: Container;
  @Input() towers: Array<ContainerTower>;
  //for selected boxes
  selectedBoxes: Array<BoxAvailability> = new Array<BoxAvailability>();
  selectedBoxPositions: Array<string> = new Array<string>();
  //towers selected
  tower_selected: Array<number> = new Array<number>();
  @Output() boxesSelected: EventEmitter<Array<BoxAvailability>> = new EventEmitter<Array<BoxAvailability>> ();
  @Output() lastSelectedOccupiedSlot: EventEmitter<string> = new EventEmitter<string> ();
  _towers: Array<ContainerTower>;
  box_count_per_shelf: number = 1;
  //_shelfBoxes: Array<Array<BoxAvailability>> = new Array<Array<BoxAvailability>>();
  _container: Container;

  //all the group box
  permited_boxes: Array<Box> = new Array<Box>();
  permited_box_positions: Array<string> = new Array<string>();
  //how many towers to show in a table
  tower_per_table: number = 10;
  towers_splited: Array<Array<ContainerTower>> = new Array<Array<ContainerTower>>();
  transformed_towers : Array<Array<BoxAvailability>> = new Array<Array<BoxAvailability>>();
  splited_towers_post_transformation: Array<Array<Array<BoxAvailability>>> = new Array<Array<Array<BoxAvailability>>>();

  //loading 
  loading: boolean = true;

  constructor(private utilityService: UtilityService, @Inject(APP_CONFIG) private appSetting: any, private containerService: ContainerService) { 
    this.tower_per_table = appSetting.CONTAINER_FULLNESS_OVERVIEW_TOWER_PER_TABLE;
  }

  ngOnInit() {}

  ngOnChanges(change: SimpleChanges){
    //console.log(change);
    if(change["towers"] != undefined){
      this._towers = this.towers;
      this.box_count_per_shelf = this._towers.length > 0 ? this._towers[0].shelves[0].boxAvailabilities.length : 1;
      this.transformed_towers = this.transformTowers(this._towers);
      this.splited_towers_post_transformation = this.spliteTowerAfterTransform(this.transformed_towers, this.tower_per_table, this._towers);
      //this.loading = true;
      //splite towers
      //this.towers_splited = this.splitTowers(this._towers, this.tower_per_table);
    }
    if(change["container"] != undefined){
      this._container = this.container;
      //get group boxes of the container
      this.containerService.containerGroupBoxes(this._container.pk)
      .subscribe((boxes: any)=>{
        this.permited_boxes = boxes;
        this.permited_box_positions = this.obtainPermittedBoxPositions(this.permited_boxes);
      },
      (error) => console.log(error));
    }
  }

  //not used anymore, due to performace issue. splite towers for multiple tables
  splitTowers(towers: Array<ContainerTower>, tower_per_table: number): Array<Array<ContainerTower>>{
    let _towers_splited: Array<Array<ContainerTower>> = [];
    if(towers.length <= tower_per_table){
      _towers_splited.push(towers);
    }
    else{
      for(let c=0; c < towers.length; c=c+tower_per_table){
        let sub_towers:Array<ContainerTower> = [];
      for(let s = 0; s< tower_per_table; s++){
        if(s+c < towers.length){
          sub_towers.push(towers[(s+c)]);
        }
      }
        _towers_splited.push(sub_towers);
      }
    }
    return _towers_splited;
  }

  //alternative way of splite towers
  spliteTowerAfterTransform(shelves: Array<Array<BoxAvailability>>, tower_per_table: number, towers: Array<ContainerTower>): Array<Array<Array<BoxAvailability>>>{
    if(towers.length == 0) return [];
    let box_count_per_shelf = towers[0].shelves[0].boxAvailabilities.length;
    let _shelves_splited: Array<Array<Array<BoxAvailability>>> = new Array<Array<Array<BoxAvailability>>>();
    if(shelves == null) return [];
    let total_box_per_table: number = tower_per_table * box_count_per_shelf;
    let total_box_per_shelf = shelves[0].length;
    if(shelves[0].length < total_box_per_table){
      total_box_per_table = total_box_per_shelf;
    };

    for(let c = 0; c < total_box_per_shelf; c = c + total_box_per_table){
      let shelves_per_split : Array<Array<BoxAvailability>> = new Array<Array<BoxAvailability>>();
      shelves.forEach((shelf, i)=>{
        let box_per_shelf: Array<BoxAvailability> = [];
        for(let x = 0; x < total_box_per_table; x++){
          if(x+c < total_box_per_shelf){
            box_per_shelf.push(shelf[x+c]); 
          }           
        }
        if(box_per_shelf.length>0){
          shelves_per_split.push(box_per_shelf); 
        }         
      });
      _shelves_splited.push(shelves_per_split);
    }
    this.loading = false;
    return _shelves_splited;
  }

  transformTowers(towers: Array<ContainerTower>): Array<Array<BoxAvailability>>{
    if (towers.length==0) return [];
    let shelfBoxes: Array<Array<BoxAvailability>> = [];
    let total_shelf : number = towers[0].shelves.length;
    for(let s = 0; s< total_shelf; s++){
      let array: Array<BoxAvailability> =[];
      towers.forEach((t, i)=>{   
        t.shelves[s].boxAvailabilities.forEach((b, bi)=>{
          array.push(b);
        })   
      })
      shelfBoxes.push(array);
    }
    return shelfBoxes;
  }

  getBoxCount(tower: ContainerTower){
    if(tower == null) return [];
    let max_box_count = tower.shelves[0].boxAvailabilities.length;
    return this.utilityService.genArray(max_box_count);
  }

  toggleSelection(box: BoxAvailability){
    //fire the selection event
    let lastSelectedBoxPosition: string = null;
    if(this.selectedBoxes.length === 0){
      this.selectedBoxes.push(box);
      lastSelectedBoxPosition = box.available == false? box.full_position : null ;
    }
    else
    {
      //get the posiiton array
      let positions: Array<string> = this.obtainBoxPostions(this.selectedBoxes)
      let index: number = positions.indexOf(box.full_position);
      if(index !== -1){
        this.selectedBoxes.splice(index, 1);
        lastSelectedBoxPosition = this.obtainLastOccupiedBoxPosition(this.selectedBoxes);        
      }
      else{
        this.selectedBoxes.push(box);
        lastSelectedBoxPosition = box.available == false? box.full_position : this.obtainLastOccupiedBoxPosition(this.selectedBoxes);
      }    
    }
    this.selectedBoxes.sort(this.utilityService.sortArrayBySingleProperty('full_position'));
    this.lastSelectedOccupiedSlot.emit(lastSelectedBoxPosition);
    this.boxesSelected.emit([...this.selectedBoxes]); //emit new obj to force the change detection
    this.selectedBoxPositions = this.obtainBoxPostions(this.selectedBoxes);    
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

  obtainPermittedBoxPositions(boxes: Array<Box>): Array<string>{
    let positions: Array<string> = new Array<string>();
    if(boxes.length>0){
      boxes.forEach((b, i)=>{
        positions.push(b.box_position);
      });
    }
    return positions
  }

  obtainLastOccupiedBoxPosition(selectedBoxes: Array<BoxAvailability>): string{
    let position = null;
    if(selectedBoxes.length > 0){
      let array: Array<BoxAvailability> = [...selectedBoxes];
      array.sort(this.utilityService.sortArrayBySingleProperty('full_position'));
      let all_occupied_boxes: Array<BoxAvailability> = array.filter((b, i)=>{ return b.available == false; });
      if(all_occupied_boxes.length>0){
        position = all_occupied_boxes[all_occupied_boxes.length -1].full_position;
      }

    }  
    return position;
  }

  clearSelection(){
    this.selectedBoxes = [];
    this.selectedBoxPositions = [];
    this.boxesSelected.emit([]);
    this.lastSelectedOccupiedSlot.emit(null);
  }

  genTowerCount(c: number){
    return this.utilityService.genArray(c);
  }
  
  toggleTowerSelection(tower: number, count: number){
    let tower_clicked = tower + count * this.tower_per_table;
    //find the tower_clicked in the tower_selected
    let index_clicked = this.tower_selected.indexOf(tower_clicked);
    if(index_clicked != -1){
      this.tower_selected.splice(index_clicked, 1);
      //clear all the selected all boxes in the current tower
      this.selectedBoxes = this.selectedBoxes.filter((box, i)=>{
        return box.full_position.startsWith(tower_clicked+"-") === false;
      });
    }
    else{
      this.tower_selected.push(tower_clicked);
      //select all the boxes in the current tower
      if(this._towers.length > 0 && (tower_clicked -1) < this._towers.length ){
        let containerTower: ContainerTower = this._towers[ tower_clicked -1 ];
        containerTower.shelves.forEach((shelf, si)=>{
          //filter out not permitted boxes
          this.selectedBoxes = [
            ...this.selectedBoxes, 
            ...shelf.boxAvailabilities.filter((box, i)=>{
              return box.available == true;
            }),
            ...shelf.boxAvailabilities.filter((box, i)=>{
              return this.permited_box_positions.indexOf(box.full_position) != -1;
            })
          ];
          //end filter out block
        });
      }
    }
    this.selectedBoxes.sort(this.utilityService.sortArrayBySingleProperty('full_position'));
    this.boxesSelected.emit([...this.selectedBoxes]); //emit new obj to force the change detection
    this.selectedBoxPositions = this.obtainBoxPostions(this.selectedBoxes);
    this.lastSelectedOccupiedSlot.emit(this.obtainLastOccupiedBoxPosition(this.selectedBoxes));
  }
}
