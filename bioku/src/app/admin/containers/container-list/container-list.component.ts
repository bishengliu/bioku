import { Component, OnInit, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { AppSetting} from '../../../_config/AppSetting';
import {APP_CONFIG} from '../../../_providers/AppSettingProvider';
import { AppStore } from '../../../_providers/ReduxProviders';
import { Group, GroupInfo } from '../../../_classes/Group';
import { User } from '../../../_classes/User';
import { Container } from '../../../_classes/Container';
import { Box } from '../../../_classes/Box';
import { Observable } from 'rxjs';

import { AlertService } from '../../../_services/AlertService';
import { ContainerService} from '../../../_services/ContainerService';
import {GroupService} from '../../../_services/GroupService';
@Component({
  selector: 'app-container-list',
  templateUrl: './container-list.component.html',
  styleUrls: ['./container-list.component.css']
})
export class ContainerListComponent implements OnInit {
  containers: Observable<Array<Container>>;
  groups: Observable<Array<Group>>;
  appUrl: string;
  tableView: boolean = false;

  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private router: Router, 
              private alertService: AlertService, private containerService: ContainerService, private groupService: GroupService)
  { 
    this.appUrl = this.appSetting.URL;
  }

  toggleList(){
    this.tableView = !this.tableView;
  }

  renderRowSpan(container:Container) : number {
    let rowspan = ((container.groups && container.groups.length > 0) || (container.boxes && container.boxes.length > 0)) 
        ? 
          Math.max
          (
            (container.groups && container.groups.length > 0) ? container.groups.length: 1, 
            (container.boxes && container.boxes.length > 0) ? container.boxes.length: 1
          ) 
        :
        1;
      return rowspan;
  }

  genArray(num : number){
    let array: Array<number> = [];
    if(num >= 1){
      for(let x = 1; x <= num; x++){
      array.push(x);
      }
    }
    else{
      array.push(1);
    }
    return array;
  }

  add2Group(container_pk: number, ctl: any): void{
    console.log('container: ' + container_pk);
    console.log('group: ' + ctl.value);
  }
  removefromGroup(container_pk: number, group_pk: number){
    console.log('container: ' + container_pk);
    console.log('group: ' + group_pk);
  }
  isGroup(groups: Array<Group>, group: Group){
    let found: Boolean = false;
    if (groups == null){
      return found;
    }
    let pks: Array<number> = groups.map(g=>g.pk);   
    pks.indexOf(group.pk) !=-1 ? found=true : found=false;
    return found;
  }
  ngOnInit() {
    this.containers = this.containerService.getAllContainers();
    this.groups = this.groupService.getAllGroups();
  }

}
