import { Component, OnInit, Inject, Input } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { Container } from '../../_classes/Container';
import {  UtilityService } from '../../_services/UtilityService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { ContainerTower, Containershelf, BoxAvailability } from '../../_classes/ContainerTower';

@Component({
  selector: 'app-container-box-overview',
  templateUrl: './container-box-overview.component.html',
  styleUrls: ['./container-box-overview.component.css']
})
export class ContainerBoxOverviewComponent implements OnInit {
  @Input() container: Container;
  @Input() towers: Array<ContainerTower>;

  _towers: Array<ContainerTower>;
  _shelfBoxes: Array<Array<BoxAvailability>> = new Array<Array<BoxAvailability>>();

  //how many towers to show in a table
  tower_per_table: number = 10;
  towers_splited: Array<Array<ContainerTower>> = new Array<Array<ContainerTower>>();
  shelfBoxes_splited : Array<Array<Array<BoxAvailability>>> = new Array<Array<Array<BoxAvailability>>>();

  constructor(private utilityService: UtilityService, @Inject(APP_CONFIG) private appSetting: any) { 
    this.tower_per_table = appSetting.CONTAINER_FULLNESS_OVERVIEW_TOWER_PER_TABLE;
  }

  ngOnInit() {}

  ngOnChanges(change: SimpleChanges){
    this._towers = this.towers;
    //splite towers
    this.towers_splited = this.splitTowers(this._towers, this.tower_per_table);
    //console.log(this.towers_splited);
    this._shelfBoxes = this.transformTowers(this._towers);
  }

  //splite towers for multiple tables
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

  boxClicked(box: BoxAvailability){
    console.log(box);
  }
}
