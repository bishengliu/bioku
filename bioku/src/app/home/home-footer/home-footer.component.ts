import { Component, OnInit, Inject } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.css']
})
export class HomeFooterComponent implements OnInit {
  appName: string;
  appVersion: string;
  constructor(@Inject(APP_CONFIG) private appSetting: any) { 
    //app name
    this.appName = this.appSetting.NAME;
    this.appVersion = this.appSetting.VERSION;
  }

  ngOnInit() {
  }

}
