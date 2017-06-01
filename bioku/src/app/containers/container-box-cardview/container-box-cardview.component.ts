import { Component, OnInit, Inject, Input } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import {  ContainerService } from '../../_services/ContainerService';
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
  container: Container = null;
  currentSampleCount : number = 0;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private containerService: ContainerService,) { 
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
    if (state.containerInfo && state.containerInfo.currentContainer){
      this.container = state.containerInfo.currentContainer;
    }
  }
  updateRate(rate: number, box_position: string){
    this.rate = rate;
    this.containerService.updateBoxRate(this.container.pk, box_position, rate)
    .subscribe(()=>{},(err)=>console.log(err));  
  }
  clearRate(box_position: string){
    this.containerService.updateBoxRate(this.container.pk, box_position, 0)
    .subscribe(()=>this.rate =0,(err)=>console.log(err));
  }
  ngOnInit() {
    if(this.box != null){
      this.rate =  this.box.rate == null ? 0 : this.box.rate;
      this.color = this.box.color == null ? "#ffffff" : this.box.color;
      this.currentSampleCount = this.box.samples.filter((s:Sample)=>s.occupied == true).length;
    }    
  }
}
