import { Component, OnInit, Inject } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { LogoutService } from '../../_services/LogoutService';
import { User } from '../../_classes/User';
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css']
})
export class HomeHeaderComponent implements OnInit {
  appName: string;
  appUrl: string;
  isLogin: boolean = false;
  user: User = null;
  roles: string = "";
  groups: string = "";
  private _opened: boolean = false;

  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private logoutService: LogoutService) {
    //app name
    this.appName = this.appSetting.NAME;
    this.appUrl = this.appSetting.URL;
    appStore.subscribe(()=> this.updateState());
    this.updateState();
  }

  Logout(){
    this.logoutService.logOut();
  }
  
  updateState(){
    let state= this.appStore.getState()
    if(state.authInfo){      
      this.user = state.authInfo.authUser;
      this.isLogin = state.authInfo.token? true: false;
      if(this.isLogin){
        //rolels
        let rArray = (this.user && this.user.roles) ? this.user.roles : [];
        if (rArray.length >0){
          for(let r in rArray){
            this.roles += rArray[r] + ', ';
          }
          this.roles = this.roles.slice(0, -2);
        }
        
        //groups
        let gArray = (this.user && this.user.groups) ? this.user.groups : [];
        if(gArray.length >0){
          for(let g in gArray){
            this.groups +=  gArray[g].group + ', ';
          }
          this.groups = this.groups.slice(0, -2);
        }        
      }
    }
  }

  //sidebar
  private _toggleSidebar() {
    this._opened = !this._opened;
  }

  ngOnInit() {}

}
