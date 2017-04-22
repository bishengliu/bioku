import { Component, OnInit, Inject } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { LogoutService } from '../../_services/LogoutService';
@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css']
})
export class HomeHeaderComponent implements OnInit {
  appName: string;
  constructor(@Inject(APP_CONFIG) private appSetting: any, private logoutService: LogoutService) {
    //app name
    this.appName = this.appSetting.NAME;
  }
  Logout(){
    this.logoutService.logOut();
  }
  ngOnInit() {
  }

}
