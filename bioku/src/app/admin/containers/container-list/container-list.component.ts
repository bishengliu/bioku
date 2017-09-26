import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  styleUrls: ['./container-list.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerListComponent implements OnInit {
  containers: Observable<Array<Container>>;
  groups: Observable<Array<Group>>;
  appUrl: string;
  tableView: boolean = false;
  //for list table view only 
  rowspan: number = 1;

  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private router: Router, private changeDetector: ChangeDetectorRef,
              private alertService: AlertService, private containerService: ContainerService, private groupService: GroupService)
  { 
    this.appUrl = this.appSetting.URL;
  }

  toggleList(){
    this.tableView = !this.tableView;
  }

  renderRowSpan(container:Container) : number {
    this.rowspan = ((container.groups && container.groups.length > 0) || (container.boxes && container.boxes.length > 0)) 
        ? 
          Math.max
          (
            (container.groups && container.groups.length > 0) ? container.groups.length: 1, 
            (container.boxes && container.boxes.length > 0) ? container.boxes.length: 1
          ) 
        :
        1;
      return this.rowspan;
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
    this.containerService.addContainer2Group(container_pk, ctl.value)
    .subscribe(
      (group: Group)=>{        
        this.alertService.success("Container is assigned to the selected group!", true);
        this.containers = this.containerService.getAllContainers();       
        //this.router.navigate(['/admin/containers']);
      },
      (err: any)=>{
        console.log(err);
        this.alertService.error("Something went wrong, container not assigned to the selected group!", true);
      }
    )
  }
  removefromGroup(container_pk: number, group_pk: number){
    this.containerService.removeGroupFromContainer(container_pk, group_pk)
    .subscribe(
      (group: Group)=>{
        this.alertService.success("Container is removed to the selected group!", true);
        //this.router.navigate(['/admin/containers']);
        this.containers = this.containerService.getAllContainers();
      },
      (err: any)=>{
        console.log(err);
        this.alertService.error("Something went wrong, container is not removed to the selected group!", true);
      }
    )
  }
  isGroup(groups: Array<Group>, group: Group){
    let found: Boolean = false;
    if (groups == null){
      return found;}
    let pks: Array<number> = groups.map(g=>g.pk);   
    pks.indexOf(group.pk) !=-1 ? found=true : found=false;
    return found;
  }
  allowRemoveGroup(container_pk: number, group_pk: number){
    return this.containerService.allowRemoveGroup(container_pk, group_pk)
           .subscribe(
                  data=>(data.detail ? true: false), 
                  err=>false);
  }
  ngOnInit() { 
    this.containers = this.containerService.getAllContainers();
    this.containers.subscribe(
      //c=> console.log(c)
    )
    this.groups = this.groupService.getAllGroups();
  }

}
