import { Component, OnInit, Inject, Input } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { ContainerService } from '../../_services/ContainerService';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
//mydatepicker
import {IMyOptions} from 'mydatepicker';

@Component({
  selector: 'app-box-detail-action-panel',
  templateUrl: './box-detail-action-panel.component.html',
  styleUrls: ['./box-detail-action-panel.component.css']
})
export class BoxDetailActionPanelComponent implements OnInit {
  @Input() selectedSamples: Array<number>;
  user: User;
  appUrl: string;
  container: Container = null;
  box: Box = null;
  boxDescription: string;
  samples: Array<Sample> =[];
  freezing_date = {}; //for only select one sample
  action_panel_msg: string= null;
  //mydatepicker
  private myDatePickerOptions: IMyOptions = {
        // other options...
        todayBtnTxt: 'Today',
        dateFormat: 'yyyy-mm-dd',
        openSelectorTopOfInput: true,
        showSelectorArrow: false,
        editableDateField: false,
        openSelectorOnInputClick: true};
  
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
    if (state.containerInfo && state.containerInfo.currentBox){
      this.box = state.containerInfo.currentBox;
      this.boxDescription = this.box.description;
    }
  }
  //find the samples from selected pks
  findSamples(pks: Array<number>){
    let samples = [];
    if (pks != null && pks.length >0){
      samples = this.box.samples.filter((s:Sample)=> pks.indexOf(+s.pk) !== -1);
    }
    return samples;
  }

  parseFreezingDate(date: string){
    console.log(date);
      let freezing_date = {};
      if(date){
        let dArray = date.split('-');
        freezing_date ={date: {year: +dArray[0], month: +dArray[1], day: +dArray[2]}};
      }
      console.log(freezing_date);
      return freezing_date;
  }

  updateSampleDetail(value:any, box_position: string, data_attr: string, required: boolean){
    console.log(value);
    if((value == "" || value == null) && required){
      this.action_panel_msg = data_attr + " is required!"
    }
    else
    {
      this.action_panel_msg = null;
      //this.containerService.updateBoxDescription(this.container.pk, box_position, data_attr, value:any)
      //   .subscribe(()=>{},(err)=>console.log(err));
    }
    
  }
  ngOnInit() {}
  ngOnChanges(){
    if (this.selectedSamples != null && this.selectedSamples.length==1){
      let samples = this.findSamples(this.selectedSamples);
      this.freezing_date = this.parseFreezingDate(samples[0].freezing_date); //clear selected samples
    }
  }
}
