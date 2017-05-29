import { Component, OnInit, Inject, Input } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { User } from '../../_classes/User';

//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';

@Component({
  selector: 'app-container-box-cardview',
  templateUrl: './container-box-cardview.component.html',
  styleUrls: ['./container-box-cardview.component.css']
})
export class ContainerBoxCardviewComponent implements OnInit {
  @Input() box: Box;
  rate: number = 0;
  color: string = "#ffffff";
  user: User;
  appUrl: string;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore) { 
    this.appUrl = this.appSetting.URL;
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();
  }
  updateState(){
    let state = this.appStore.getState();
    if (state.authInfo && state.authInfo.authUser){
      this.user = state.authInfo.authUser;
    }
  }
  updateRate(rate: number){
    console.log(rate);
  }
  ngOnInit() {
    if(this.box != null){
      this.rate =  this.box.rate == null ? 0 : this.box.rate;
      this.color = this.box.color == null ? "#ffffff" : this.box.color;
    }    
  }
}
