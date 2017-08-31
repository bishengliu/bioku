import { Component, OnInit, Inject, Input } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { Container } from '../../_classes/Container';
import {  UtilityService } from '../../_services/UtilityService';
import { ContainerTower, Containershelf, BoxAvailability } from '../../_classes/ContainerTower';

@Component({
  selector: 'app-container-box-overview',
  templateUrl: './container-box-overview.component.html',
  styleUrls: ['./container-box-overview.component.css']
})
export class ContainerBoxOverviewComponent implements OnInit {
  @Input() container: Container;
  @Input() towers: Array<ContainerTower>;
  //how many towers to show in a table
  tower_per_table = 6;
  _towers: Array<ContainerTower>;
  _shelfBoxes: Array<Array<BoxAvailability>> = new Array<Array<BoxAvailability>>();
  constructor(private utilityService: UtilityService) { }

  ngOnInit() {}

  ngOnChanges(change: SimpleChanges){
    this._towers = this.towers;  
    this._shelfBoxes = this.transformTowers(this._towers);
    console.log(this._shelfBoxes);
  }

  transformTowers(towers: Array<ContainerTower>): Array<Array<BoxAvailability>>{
    if (towers.length==0)return [];
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
}
