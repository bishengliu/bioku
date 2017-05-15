import { Component, OnInit, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { AppSetting} from '../../../_config/AppSetting';
import {APP_CONFIG} from '../../../_providers/AppSettingProvider';
import { AppStore } from '../../../_providers/ReduxProviders';
import { Group, GroupInfo } from '../../../_classes/Group';
import { User } from '../../../_classes/User';
import { Observable } from 'rxjs';

import { AlertService } from '../../../_services/AlertService';
import {GroupService} from '../../../_services/GroupService';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  groups: Observable<Array<Group>>;
  appUrl: string;
  tableView: boolean = false;

  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private router: Router, private alertService: AlertService, private groupService: GroupService) { 
    this.appUrl = this.appSetting.URL;
  }
  toggleList(){
    this.tableView = !this.tableView;
  }
  
  renderRowSpan(group){
    let rowspan = ((group.assistants && group.assistants.length > 0) || (group.members && group.members.length > 0)) 
        ? 
          Math.max
          (
            (group.assistants && group.assistants.length > 0) ? group.assistants.length: 1, 
            (group.members && group.members.length > 0) ? group.members.length: 1
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
  //delete group
  deleteGroup(group: Group){
    console.log('deleting group...');
    console.log(group);
  }
  ngOnInit() {
    //get the groups
    this.groups = this.groupService.getAllGroups();
    
  }

}
