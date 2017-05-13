import { Component, OnInit, Inject } from '@angular/core';
//import { Router} from '@angular/router';
//import { AppSetting} from '../_config/AppSetting';
//import {APP_CONFIG} from '../_providers/AppSettingProvider';
//import { AppStore } from '../_providers/ReduxProviders';
//import { Observable } from 'rxjs';

import {GroupService} from '../_services/GroupService';
import { UserService } from '../_services/UserService';
import { ContainerService } from '../_services/ContainerService';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  gCount: number = 0;
  uCount: number = 0;
  cCount: number = 0;
  constructor(private groupService: GroupService, private userService: UserService, private containerService: ContainerService,) { }

  ngOnInit() {
    //group count
    this.groupService.getGroupCount().subscribe(
      c=>this.gCount = c.count,
      e=> this.gCount = 0
    );
    console.log(this.gCount);
    //user count
    this.userService.getUserCount().subscribe(
      c=>this.uCount = c.count,
      e=> this.uCount = 0
    );
    console.log(this.uCount);
    //container count
    this.containerService.getContainerCount().subscribe(
      c=>this.cCount = c.count,
      e=> this.cCount = 0
    );
    console.log(this.cCount);
  }

}
