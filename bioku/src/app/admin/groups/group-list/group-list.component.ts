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
  //outputs: ['gCount', ],
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  groups: Observable<Array<Group>>;
  users: Observable<User>;
  appUrl: string;
  gCount: number = 0;

  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,private router: Router, private alertService: AlertService, private groupService: GroupService) { 
    this.appUrl = this.appSetting.URL;
  }

  ngOnInit() {
    //get the groups
    this.groups = this.groupService.getAllGroups();
    this.groups.subscribe(
      c=>this.gCount = c.length,
      e=> this.gCount = 0
    );
    //get the users
  }

}
