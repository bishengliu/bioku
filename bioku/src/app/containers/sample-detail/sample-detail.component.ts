import { Component, OnInit, Inject, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { ContainerService } from '../../_services/ContainerService';
import {  AlertService } from '../../_services/AlertService';
//mydatepicker
import {IMyOptions} from 'mydatepicker';
//color picker
import { IColorPickerConfiguration } from 'ng2-color-picker';

//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
@Component({
  selector: 'app-sample-detail',
  templateUrl: './sample-detail.component.html',
  styleUrls: ['./sample-detail.component.css']
})
export class SampleDetailComponent implements OnInit {
  @Input() samplePK: number;
  sample: Sample = new Sample();
  user: User;
  appUrl: string;
  container: Container = null;
  box: Box = null;
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
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, 
              private containerService: ContainerService, private alertService: AlertService, private router: Router, private route: ActivatedRoute) { 
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
    }
  }

  ngOnInit() {
  }
  ngOnChanges(){
    if(this.samplePK != null){
      this.sample = this.findSample(this.samplePK);
      if(this.sample != null){
        this.freezing_date = this.parseFreezingDate(this.sample.freezing_date.toString());
        this.vertical_options = this.renderOptions(this.box.box_vertical, true);
        this.horizontal_options = this.renderOptions(this.box.box_horizontal, false);
      }
    }  
  }

  findSample(pk: number){
    let sample : Sample = new Sample();
    if (pk != null){
      let samples = this.box.samples.filter((s: Sample)=> { return +pk == s.pk; });
      if(samples != null && samples.length === 1)
      {
        sample = samples[0];
      } 
    }   
    return sample;
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
  parseFreezingDate(date: string){
    let freezing_date = {};
    if(date){
      let dArray = date.split('-');
      freezing_date ={ date: {year: +dArray[0], month: +dArray[1], day: +dArray[2]} };}
    return freezing_date;
  }
  //route force refrsh
  forceRefresh(){
    this.router.navigate(['/containers', this.container.pk], { queryParams: { 'box_position': this.box.box_position } });  
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
        .subscribe(()=>{
          this.action_loader = false;
          this.alertService.success("sample is moved to the new position (" + new_vposition + new_hposition + ")!", true);
          this.forceRefresh();
        },(err)=>{
          this.alertService.error("Something went wrong, failed to move the sample to new position(" + new_vposition + new_hposition + ")!", true);
          this.forceRefresh();
        });
      }
    }      
  }

  //take or put sample back
  //need to fix the issue here
  takeSingleSampleOut(box_position: string, sample: Sample, sample_position: string){
    this.action_panel_msg = null;
    //get today 
    let today = new Date()
    let date_out = today.getFullYear() + '-'+ (today.getMonth() + 1) + '-'+ today.getDate();
    sample.date_out = today;
    sample.occupied = false;
    this.containerService.takeSampleOut(this.container.pk, box_position, sample_position)
    .subscribe(()=>{
      this.alertService.success("sample at: " + sample_position + " is token out!", true);
      this.forceRefresh();
    },(err)=>{
      this.alertService.error("Something went wrong, failed to take out the sample at: " + sample_position + "!", true);
      this.forceRefresh();
    });   
  }

  //put single sample back
  putSingleSampleBack(box_position: string, sample: Sample, sample_position: string){
    this.action_panel_msg = null;
    let today = new Date()
    let date_out = today.getFullYear() + '-'+ (today.getMonth() + 1) + '-'+ today.getDate();
    sample.date_out = null;
    sample.occupied = true;
    this.containerService.putSampleBack(this.container.pk, box_position, sample_position)
    .subscribe(()=>{
      this.alertService.success("sample at: " + sample_position + " is put back!", true);
      this.forceRefresh();
    },(err)=>{
      this.alertService.error("Something went wrong, failed to put back the sample at: " + sample_position + "! The slot could have been occupied, try to move the sample instead!", true);
      this.forceRefresh();
    });
  }

  moveSingleSample(){

  }
  EditSample(){

  }
}
