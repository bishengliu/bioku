import { Component, OnInit, Inject } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css']
})
export class HomeHeaderComponent implements OnInit {
  appName: string;
  constructor(@Inject(AppSetting) appSetting: any) {
    //app name
    this.appName = appSetting.NAME;
  }

  ngOnInit() {
  }

}
