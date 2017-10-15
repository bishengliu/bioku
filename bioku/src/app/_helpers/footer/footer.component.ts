import { Component, OnInit, Inject } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  appName: string;
  appVersion: string;
  constructor(@Inject(APP_CONFIG) private appSetting: any) {
    // app name
    this.appName = this.appSetting.NAME;
    this.appVersion = this.appSetting.VERSION;
  }
  ngOnInit() {}
}
