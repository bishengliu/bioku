import { Component, OnInit, Inject } from '@angular/core';
import { Router} from '@angular/router';
// import { AppSetting} from '../_config/AppSetting';
// import {APP_CONFIG} from '../_providers/AppSettingProvider';
// import { AppStore } from '../_providers/ReduxProviders';
// import { Observable } from 'rxjs';

import {GroupService} from '../_services/GroupService';
import { UserService } from '../_services/UserService';
import { ContainerService } from '../_services/ContainerService';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  gCount: Number = 0;
  uCount: Number = 0;
  cCount: Number = 0;
  constructor(private groupService: GroupService, private userService: UserService,
              private containerService: ContainerService, private router: Router) { }

  ngOnInit() {
    // group count
    this.groupService.getGroupCount().subscribe(
      c => this.gCount = c.count,
      e => this.gCount = 0
    );
    // user count
    this.userService.getUserCount().subscribe(
      c => this.uCount = c.count,
      e => this.uCount = 0
    );
    // container count
    this.containerService.getContainerCount().subscribe(
      c => this.cCount = c.count,
      e => this.cCount = 0
    );
    this.router.navigate(['/admin/groups']);
  }
}
