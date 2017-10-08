import { Component, OnInit, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { User } from '../../_classes/User';
import { Group, GroupInfo } from '../../_classes/Group';
import { Container } from '../../_classes/Container';
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
import { RefreshService } from '../../_services/RefreshService';
//service
import {GroupService} from '../../_services/GroupService';
import { AlertService } from '../../_services/AlertService';
import { LogAppStateService } from '../../_services/LogAppStateService';
import { LogoutService } from '../../_services/LogoutService';
//custom from validator
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';

//redux action
import { addAssistantAsync, addMemberAsync, removeAssistantAsync, removeMemberAsync } from '../../_redux/account/account_actions';
import { SetCurrentContainerAction, setCurrentContainerActionCreator } from '../../_redux/container/container_actions';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {
  appName: string;
  appUrl: string;
  isLogin: boolean = false;
  user: User = null;
  groups: Array<Group> = null;
  assistEmailInput: FormControl = new FormControl();
  memberEmailInput: FormControl = new FormControl();
  private _opened: boolean = false;
  //for validation message
  showAssistantMsg: boolean = true;
  showMemberMsg: boolean = true;
  //for my container list
  hasContainers: boolean = false;
  private _container_opened: boolean = false;
  containers: Array<Container> = null;
  currentContainer: Container = null;
  //check whether the auth user is admin
  isAdmin: boolean = false;

  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private logoutService: LogoutService, private groupService: GroupService,  
              private router: Router, private cValidators: CustomFormValidators, private refreshService: RefreshService,
              private alertService: AlertService,private logAppStateService: LogAppStateService, ) {
    //app name
    this.appName = this.appSetting.NAME;
    this.appUrl = this.appSetting.URL;
    appStore.subscribe(()=> this.updateState()); 
    //fetch container data
    this.updateState();
    if(this.appStore.getState().containerInfo != null && this.appStore.getState().containerInfo.contaners == null){
      this.refreshService.dispatchContainerInfo();
    }
    //form controls for adding member or assistants
    this.assistEmailInput = new FormControl('', Validators.compose([Validators.required, Validators.email]), this.cValidators.emailAsyncValidator(-1));
    this.memberEmailInput = new FormControl('', Validators.compose([Validators.required, Validators.email]), this.cValidators.emailAsyncValidator(-1));
  }
  //sidebar
  private _toggleSidebar() {
    this._opened = !this._opened;
  }
  //container sidebar
  private _toggleContainerSidebar() {
    this._container_opened = !this._container_opened;
  }
  //logout
  Logout(){
    this.logoutService.logOut();
    this._opened = false;
    this._container_opened = false;
    this.router.navigate(['/']);
  }
  //edit my group profile
  editGroup(groupInfo: GroupInfo){
    this._opened = false;
    this._container_opened = false;
    //console.log(groupInfo);
    //navigate to group
    this.router.navigate(['/user/group', groupInfo.pk]);
  }
  //add assistant to a group
  addAssistant(groupInfo: GroupInfo, email: any){
    this.appStore.dispatch(addAssistantAsync(groupInfo.pk, email, this.groupService, this.alertService, this.logAppStateService));
  }
  //add researcher to a group
  addMember(groupInfo: GroupInfo, email: any){
    this.appStore.dispatch(addMemberAsync(groupInfo.pk, email, this.groupService, this.alertService, this.logAppStateService));    
  }
  //remove assistant to a group
  removeAssistant(groupInfo: GroupInfo, assistant){
    this.appStore.dispatch(removeAssistantAsync(groupInfo.pk, assistant.user_id, this.groupService, this.alertService, this.logAppStateService));
  }
  //remove researcher to a group
  removeMember(groupInfo: GroupInfo, member){
    this.appStore.dispatch(removeMemberAsync(groupInfo.pk, member.user_id, this.groupService, this.alertService, this.logAppStateService));    
  }
  hideValidation(type: string){
    if (type === 'assistant'){ 
      setTimeout(()=>{
        this.showAssistantMsg = false;
      }, 2000) 
    }
    if(type === 'member'){
      setTimeout(()=>{
        this.showMemberMsg = false;
      }, 2000)       
    }
  }
  showValidation(type: string){
    if (type === 'assistant'){
      this.showAssistantMsg = true;   
    }
    if(type === 'member'){
      this.showMemberMsg = true;     
    }
  }
  //select a container
  displayContainerBoxes(container_pk: number){
    let currentContainers = this.containers.filter((c)=>c.pk===container_pk);
    if(currentContainers.length > 0){
      let setCurrentContainerAction : SetCurrentContainerAction = setCurrentContainerActionCreator(currentContainers[0]);
      this.appStore.dispatch(setCurrentContainerAction);
      this.refreshService.dumpContainerState(this.appStore.getState().containerInfo);
      this._opened = false;
      this._container_opened = false;
      this.router.navigate(['/containers', container_pk]);
    }
  }
  go2ContainerList(){
    this._opened = false;
    this._container_opened = false;
    this.router.navigate(['/containers']);
  }
  //update redux state
  updateState(){
    let state= this.appStore.getState()
    if(state.authInfo){      
      this.user = state.authInfo.authUser;
      this.groups = state.authInfo.authGroup;
      this.isLogin = state.authInfo.token? true: false;
      if(this.user){
        this.isAdmin = this.user.is_superuser;
      }
      if (this.isLogin){
        //check the container list
        if(state.containerInfo && state.containerInfo.containers){
          this.containers = state.containerInfo.containers;
          this.currentContainer = state.containerInfo.currentContainer;
          this.hasContainers = this.containers.length > 0 ? true : false;
        }
      }
    }
  }
  goHome(){
    this.router.navigate(['/']);
  }
  ngOnInit() {}
}
