import { Component, OnInit, Inject } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.css']
})
export class HomeFooterComponent implements OnInit {
  appName: string;
  appVersion: string;
  constructor(@Inject(AppSetting) appSetting: any) { 
    //app name
    this.appName = appSetting.NAME;
    this.appVersion = appSetting.VERSION;
  }

  ngOnInit() {
  }

}
