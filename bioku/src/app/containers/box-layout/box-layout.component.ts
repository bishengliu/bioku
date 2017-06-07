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
import {  UtilityService } from '../../_services/UtilityService';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';

@Component({
  selector: 'app-box-layout',
  templateUrl: './box-layout.component.html',
  styleUrls: ['./box-layout.component.css']
})
export class BoxLayoutComponent implements OnInit {
  @Input() samples: Array<Sample>;
  @Input() searchedBoxSamples: Array<string> =[]; //cell positions
  selectedSamples: Array<number> =[] //sample pk
  selectedCells: Array<string>=[] //cell position
  @Output() sampleSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>> ();
  @Output() cellSelected: EventEmitter<Array<string>> = new EventEmitter<Array<string>> ();
  appUrl: string;
  container: Container;
  box: Box;
  currentSampleCount: number = 0; //active samples in the box
  totalBoxCapacity: number;
  user: User;
  rate: number = 0;
  color: string = "#ffffff"; //box color
  //Box position letters
  box_letters: Array<string> = [];
  //color picker
  availableColors: Array<string> = [];
  pickerOptions: IColorPickerConfiguration = { width: 25, height: 25, borderRadius: 4};
  //box hArray and vArray
  hArray: Array<number> = [];
  vArray:Array<string> = [];
  //tfoot colspan
  colspanCount: number =1;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private containerService: ContainerService, private utilityService: UtilityService)
  { 
    this.appUrl = this.appSetting.URL;
    this.availableColors = this.appSetting.APP_COLORS;
    this.box_letters = this.appSetting.BOX_POSITION_LETTERS;    
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();
  }
  genLetterArray(num:number){
    return this.box_letters.slice(0, num);
  }
  toggleSelection(h: number, v: string){
    //all samples selected
    let filterSamples = this.samples.filter((s:Sample)=> s.occupied==true && s.position.toLowerCase()===(v+h).toLowerCase())
    if(filterSamples.length  > 0 ){
      let index = this.selectedSamples.indexOf(filterSamples[0].pk);
      if(index === -1){
        this.selectedSamples.push(filterSamples[0].pk);}
      else{this.selectedSamples.splice(index, 1);}
    }
    //all positions selected
    let pIndex= this.selectedCells.indexOf(v+h);
    if(pIndex === -1){
        this.selectedCells.push(v+h);}
    else{
        this.selectedCells.splice(pIndex, 1);}
    //console.log(this.selectedCells);
    //console.log(this.selectedSamples);
    //emit observable
    this.sampleSelected.emit(this.selectedSamples);
    this.cellSelected.emit(this.selectedCells);
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
      this.hArray = this.utilityService.genArray(this.box.box_horizontal);
      this.vArray = this.genLetterArray(this.box.box_vertical);
      this.colspanCount = this.box.box_horizontal + 1;
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
  pickerSamples(h: number, v: string){
    return this.samples.filter((s:Sample)=> s.occupied==true && s.position.toLowerCase()===(v+h).toLowerCase())
  }
  ngOnInit() {
    this.sampleSelected.emit([]);//emit empty sample selected
    this.cellSelected.emit([]);////emit selected cells
    if(this.box != null){
      this.rate =  this.box.rate == null ? 0 : this.box.rate;
      this.color = this.box.color == null ? "#ffffff" : this.box.color;
      this.currentSampleCount = this.box.samples.filter((s:Sample)=>s.occupied == true).length;
      this.totalBoxCapacity = this.box.box_vertical * this.box.box_horizontal;
    }
  }
  ngOnChanges(){
    //sample
    this.selectedSamples = []; //clear selected samples
    this.sampleSelected.emit(null); //emit selected sample pk
    //cells
    this.selectedCells = []; //clear selected cells
    this.cellSelected.emit(null); //emit selected cells
  }
}
