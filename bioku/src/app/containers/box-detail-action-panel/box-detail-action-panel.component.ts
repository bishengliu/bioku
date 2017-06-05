import { Component, OnInit, Inject, Input, EventEmitter, ElementRef, ViewChild } from '@angular/core';
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
//color picker
import { IColorPickerConfiguration } from 'ng2-color-picker';

@Component({
  selector: 'app-box-detail-action-panel',
  templateUrl: './box-detail-action-panel.component.html',
  styleUrls: ['./box-detail-action-panel.component.css']
})
export class BoxDetailActionPanelComponent implements OnInit {
  @Input() selectedSamples: string; //convert it to string in the parent cmp and force triger the ngOnChanges() detection in this cmp; if set to array the ngOnChanges() won't be triggered
  samplePKs: Array<number> = [];
  user: User;
  appUrl: string;
  container: Container = null;
  box: Box = null;
  boxDescription: string;
  samples: Array<Sample> =[];
  freezing_date = {}; //for only select one sample
  action_panel_msg: string= null;
  //Box position letters
  box_letters: Array<string> = [];
  //box hposition
  box_hposition: boolean = false;
  //mydatepicker
  private myDatePickerOptions: IMyOptions = {
        // other options...
        todayBtnTxt: 'Today',
        dateFormat: 'yyyy-mm-dd',
        openSelectorTopOfInput: true,
        showSelectorArrow: false,
        editableDateField: false,
        openSelectorOnInputClick: true};

  //color picker
  availableColors: Array<string> = [];
  pickerOptions: IColorPickerConfiguration = {
    width: 8,
    height: 8,
    borderRadius: 2};
  //selection options
  vertical_options = [];
  horizontal_options = [];
  //loader
  action_loader: boolean = false;
  //view child
  @ViewChild('vposition') vposition:ElementRef;
  @ViewChild('hposition') hposition:ElementRef;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private containerService: ContainerService,) { 
    this.appUrl = this.appSetting.URL;
    this.availableColors = this.appSetting.APP_COLORS;
    this.box_letters = this.appSetting.BOX_POSITION_LETTERS;
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
  renderOptions(count: number, letter: boolean){
    let options = [];
    options.push({name:'-', value:null});
    for(let i=0; i< count; i++){
      let obj = letter? {name:this.box_letters[i], value:i}: {name:i, value:i};
      options.push(obj)
    }
    return options;
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
      let freezing_date = {};
      if(date){
        let dArray = date.split('-');
        freezing_date ={ date: {year: +dArray[0], month: +dArray[1], day: +dArray[2]} };}
      return freezing_date;
  }

  updateSampleDetail(value:any, sample: Sample, box_position: string, sample_position: string, data_attr: string, required: boolean){
    if((value == "" || value == null) && required){
      this.action_panel_msg = data_attr + " is required!"}
    else{
      this.action_panel_msg = null;            
      //sample.freezing_date
      if(data_attr == "freezing_date") { 
        value = value.formatted;
        sample.freezing_date =  value;
      }      
      this.containerService.updateSampleDetail(this.container.pk, box_position, sample_position, data_attr, value)
          .subscribe(()=>{},(err)=>console.log(err));
    } 
  }
  display_hposition(){
    if(this.vposition.nativeElement.value == null || this.vposition.nativeElement.value == ""){
      this.box_hposition = false;
    }
    else{
      if(this.hposition){
        this.hposition.nativeElement.value = null;
      }      
      this.box_hposition = true;
    }    
  }
  updateSamplePosition(sample: Sample, box_position: string, sample_position: string){
    this.action_loader = true;
    console.log(this.hposition.nativeElement.value);
    console.log(this.vposition.nativeElement.value)
    
  }
  ngOnInit() {}
  ngOnChanges(){
    this.samplePKs = [];
    if(this.selectedSamples != null && this.selectedSamples != ""){
      let sArray = this.selectedSamples.split(',');     
      for(let i=0; i< sArray.length; i++){
        if(!isNaN(+sArray[i])){
          this.samplePKs.push(+sArray[i]);}
        }
      if(this.samplePKs != null && this.samplePKs.length==1)  {
        let samples = this.findSamples(this.samplePKs);
        this.freezing_date = this.parseFreezingDate(samples[0].freezing_date);
        this.vertical_options = this.renderOptions(this.box.box_vertical, true);
        this.horizontal_options = this.renderOptions(this.box.box_horizontal, false);
      }    
    }
  }
}
