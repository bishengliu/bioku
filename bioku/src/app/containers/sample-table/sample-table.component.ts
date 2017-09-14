import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
//color picker
import { IColorPickerConfiguration } from 'ng2-color-picker';

import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { Sample, Attachment, Tissue } from '../../_classes/Sample';
import {  ContainerService } from '../../_services/ContainerService';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
@Component({
  selector: 'app-sample-table',
  templateUrl: './sample-table.component.html',
  styleUrls: ['./sample-table.component.css']
})
export class SampleTableComponent implements OnInit {
  @Input() samples: Array<Sample>;
  selectedSamples: Array<number> =[] //sample pk
  @Output() sampleSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>> ();
  appUrl: string;
  container: Container;
  box: Box;
  currentSampleCount: number = 0; //active samples in the box
  totalBoxCapacity: number;
  user: User;
  rate: number = 0;
  color: string = "#ffffff"; //box color

  //color picker
  availableColors: Array<string> = [];
  pickerOptions: IColorPickerConfiguration = {
    width: 25,
    height: 25,
    borderRadius: 4};

  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private containerService: ContainerService,) { 
    this.appUrl = this.appSetting.URL;
    this.availableColors = this.appSetting.APP_COLORS;
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();
  }

  toggleSelection(pk: number){
    if(pk != null){
      let index = this.selectedSamples.indexOf(pk);
      if(index === -1){
        this.selectedSamples.push(pk);
      }
      else{
        this.selectedSamples.splice(index, 1);
      }
    }
    //emit observable
    this.sampleSelected.emit(this.selectedSamples);
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
    }
  }
  genBorderStyle(color: string){
    let cssValue: string = "1px solid rgba(34,36,38,.15)";
    if(color != null){
      cssValue = "3px solid " + color;
    }
    return cssValue;
  }
  //rate box
  updateRate(rate: number, box_position: string){
    this.rate = rate;
    this.containerService.updateBoxRate(this.container.pk, box_position, rate)
    .subscribe(()=>{},(err)=>console.log(err));  
  }
  clearRate(box_position: string){
    this.containerService.updateBoxRate(this.container.pk, box_position, 0)
    .subscribe(()=>this.rate =0,(err)=>console.log(err));
  }
  //update box color
  updateColor(color: string, box_position: string){
    this.color = color;
    this.containerService.updateBoxColor(this.container.pk, box_position, color)
    .subscribe(()=>{},(err)=>console.log(err));
  }
  //update description
  updateDescription(text: string, box_position: string){
    this.containerService.updateBoxDescription(this.container.pk, box_position, text)
    .subscribe(()=>{},(err)=>console.log(err));
  }
  //update box label
  updateLabel(text: string, box_position: string){
    this.containerService.updateBoxLabel(this.container.pk, box_position, text)
    .subscribe(()=>{},(err)=>console.log(err));
  }
  ngOnInit() {
    this.sampleSelected.emit([]);//emit empty sample selected
    if(this.box != null){
      this.rate =  this.box.rate == null ? 0 : this.box.rate;
      this.color = this.box.color == null ? "#ffffff" : this.box.color;
      this.currentSampleCount = this.box.samples.filter((s:Sample)=>s.occupied == true).length;
      this.totalBoxCapacity = this.box.box_vertical * this.box.box_horizontal;
    }
  }
  ngOnChanges(){
    this.selectedSamples = []; //clear selected samples
    this.sampleSelected.emit(null); //emit selected sample pk
  }
}
