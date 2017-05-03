import { Component, OnInit, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { LogoutService } from '../../_services/LogoutService';
import { User } from '../../_classes/User';
import { Group, GroupInfo } from '../../_classes/Group';
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
  groups: Array<Group> = null;
  
  private _opened: boolean = false;

  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private logoutService: LogoutService, private router: Router) {
    //app name
    this.appName = this.appSetting.NAME;
    this.appUrl = this.appSetting.URL;
    appStore.subscribe(()=> this.updateState());
    this.updateState();
  }

  Logout(){
    this.logoutService.logOut();
    this._opened = false;
  }

  updateState(){
    let state= this.appStore.getState()
    if(state.authInfo){      
      this.user = state.authInfo.authUser;
      this.groups = state.authInfo.authGroup;
      this.isLogin = state.authInfo.token? true: false;      
    }
  }
  editGroup(groupInfo: GroupInfo){
    this._opened = !this._opened;
    console.log(groupInfo);
    //navigate to group
    //this.router.navigate(['group', groupInfo.pk]);
  }
  addAssistant(groupInfo: GroupInfo){
    this._opened = !this._opened;
    console.log(groupInfo);
  }
  addMember(groupInfo: GroupInfo){
    this._opened = !this._opened;
    console.log(groupInfo);
  }
  removeAssistant(assistant: User){
    this._opened = !this._opened;
    console.log(assistant);
  }
  removeMember(member: User){
    this._opened = !this._opened;
    console.log(member);
  }
  //sidebar
  private _toggleSidebar() {
    this._opened = !this._opened;
  }

  changePassword(){
    this._opened = !this._opened;
  }
  updateProfile(){
    this._opened = !this._opened;
    //this.router.navigate(['/user']);
  }
  ngOnInit() {}

}
