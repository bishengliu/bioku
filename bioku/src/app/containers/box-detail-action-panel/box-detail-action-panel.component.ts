import { Component, OnInit, Inject, Input, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { ContainerService } from '../../_services/ContainerService';
import {  AlertService } from '../../_services/AlertService';
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
  @Input() selectedCells: string; //same as above
  samplePKs: Array<number> = []; //real sample pk array selected
  cells: Array<string> = []; //real cells selected
  user: User;
  appUrl: string;
  container: Container = null;
  box: Box = null;
  boxDescription: string;  
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
  //when multiple samples selected
  occupiedSamples: Array<Sample> =[];//occupied samples
  preoccupiedSamples: Array<Sample> =[]; //previous occupied samples
  emptySelectedCells: Array<string> =[]; //selected cells that are empty
  //view child
  @ViewChild('vposition') vposition:ElementRef;
  @ViewChild('hposition') hposition:ElementRef;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private containerService: ContainerService, private alertService: AlertService) { 
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
    for(let i=1; i<= count; i++){
      let obj = letter? {name:this.box_letters[i-1], value:this.box_letters[i-1]}: {name:i, value:i};
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
    this.action_panel_msg = null;
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
          .subscribe(()=>{},(err)=>console.log(this.action_panel_msg = "fail to update sample detail!"));
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
    this.action_panel_msg = null;
    this.action_loader = true;
    var new_hposition = this.hposition.nativeElement.value;
    var new_vposition = this.vposition.nativeElement.value;
    sample.position = new_vposition + new_hposition;
    if((!isNaN(+new_hposition) && +new_hposition >=1) && (new_vposition != "" && new_vposition != null) ){
      if((new_vposition === sample.vposition.toLowerCase()) && +new_hposition === +sample.hposition){
        this.action_panel_msg = "The new position is the same as current sample position, sample position not changed!";
      }
        else{
        this.action_panel_msg = null;
        this.containerService.updateSamplePosition(this.container.pk, box_position, sample_position, new_vposition, new_hposition)
        .subscribe(()=>{this.action_loader = false;},(err)=>{console.log(err);this.action_loader = false;});
      }
    }      
  }

  //take or put sample back
  //need to fix the issue here
  takeSingleSampleOut(box_position: string, sample: Sample, sample_position: string){
    console.log('take single sample out...');
    this.action_panel_msg = null;
    //get today 
    let today = new Date()
    let date_out = today.getFullYear() + '-'+ (today.getMonth() + 1) + '-'+ today.getDate();
    sample.date_out = today;
    sample.occupied = false;
    this.containerService.takeSampleOut(this.container.pk, box_position, sample_position)
    .subscribe(()=>{},(err)=>{console.log(this.action_panel_msg = "fail to take the sample out!");});   
  }

  //put single sample back
  putSingleSampleBack(box_position: string, sample: Sample, sample_position: string){
    console.log('put sample back ...');
    this.action_panel_msg = null;
    let today = new Date()
    let date_out = today.getFullYear() + '-'+ (today.getMonth() + 1) + '-'+ today.getDate();
    sample.date_out = null;
    sample.occupied = true;
    this.containerService.putSampleBack(this.container.pk, box_position, sample_position)
    .subscribe(()=>{},(err)=>{console.log(this.action_panel_msg = "fail to put the sample back!");});
  }

  //check whether a cell has a sample
  checkSamplebyCell(cell:string){
    let findSamples = this.occupiedSamples.filter((s:Sample)=> s.position.toLowerCase()===cell.toLowerCase());
    return (findSamples != null && findSamples.length >0)? true : false;
  }

  takeMultipleSampleout(){
    console.log('take multiple sample out ...');
    let today = new Date()
    let date_out = today.getFullYear() + '-'+ (today.getMonth() + 1) + '-'+ today.getDate();
    let failed_samples='';
    let count: number = 0;
    if(this.occupiedSamples.length > 0){
      this.occupiedSamples.forEach((sample, i)=>{
        count++;
        this.containerService.takeSampleOut(this.container.pk, this.box.box_position, sample.position)
          .subscribe(()=>{},(err)=>{
            console.log(err);
            failed_samples = sample.position +" ";
            if(count == this.occupiedSamples.length){
              this.alertService.error("Something went wrong, failed to take out samples at: " + failed_samples + "!", true);
            }
          });
      });
    }
  }

  //store new samples into the box
  storeSamples(){
    console.log('store samples ...');
    console.log(this.emptySelectedCells);
  }
  
  //put multiple sample back
  putMultipleSampleBack(){
    console.log('put multiple sample back ...');
    console.log(this.preoccupiedSamples);
    let failed_samples='';
    let count: number = 0;
    if(this.preoccupiedSamples.length>0){
      this.preoccupiedSamples.forEach((sample,i)=>{
        count++;
        this.containerService.putSampleBack(this.container.pk, this.box.box_position, sample.position)
        .subscribe(()=>{},(err)=>{
          console.log(err);
          failed_samples = sample.position +" ";
          if(count == this.preoccupiedSamples.length){
            this.alertService.error("Something went wrong, failed to put back samples at: " + failed_samples + "!", true);
          }
        });
      });
    }
  }

  //switch samples
  switch2Sampleout(){
    console.log('switch samples ...');
    console.log(this.occupiedSamples);
    if(this.occupiedSamples.length ===2){
      let first_sample_position = this.occupiedSamples[0].position;
      let second_sample_position = this.occupiedSamples[1].position;
      this.containerService.switchSamplePosition(this.container.pk, this.box.box_position, first_sample_position, second_sample_position)
      .subscribe(()=>{}, ()=>{
        this.alertService.error("Something went wrong, samples were not switched!", true);
      });
    }
    else{
      this.alertService.error("Something went wrong, can only switch on 2 samples!", true);
    }
  }
  moveSamples(){
    console.log('moving samples...');
    console.log(this.occupiedSamples);
  }
  ngOnInit() {}

  ngOnChanges(){
    //samples
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
      //more sample selects
      if(this.samplePKs != null && this.samplePKs.length >=1){
        let samples = this.findSamples(this.samplePKs);
        this.occupiedSamples = samples.filter((s:Sample)=> s.occupied == true && s.date_out == null);
        this.preoccupiedSamples = samples.filter((s:Sample)=> s.occupied != true && s.date_out != null);
      }   
    }
    //positions
    this.cells = [];
    if(this.selectedCells != null && this.selectedCells != ""){
      this.cells = this.selectedCells.split(',');
    }
    //get positions that are not occupied
    this.emptySelectedCells = this.cells.filter((cell:string) => !this.checkSamplebyCell(cell));
  }
}
