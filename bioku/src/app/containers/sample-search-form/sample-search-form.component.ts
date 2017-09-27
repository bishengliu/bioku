import { Component, OnInit, Inject, Output, EventEmitter} from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { SampleSearch } from '../../_classes/Sample';
import { Container, ContainerNamePK } from '../../_classes/Container';
import {  LocalStorageService } from '../../_services/LocalStorageService';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
//custom from validator
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';
//mydatepicker
import {IMyOptions} from 'mydatepicker';

@Component({
  selector: 'app-sample-search-form',
  templateUrl: './sample-search-form.component.html',
  styleUrls: ['./sample-search-form.component.css']
})
export class SampleSearchFormComponent implements OnInit {
  container: Container = null;
  containers: Array<Container> = null;
  container_to_search: number = null;
  //all the containers
  container_name_pks: Array<ContainerNamePK> = new Array<ContainerNamePK>();
  //ALL SAMPLE TYPES
  all_sample_types: Array<String> = new Array<String>();
  freezing_date_from = {};
  freezing_date_to = {};
  //mydatepicker
  private myDatePickerOptions: IMyOptions = {
      // other options...
      todayBtnTxt: 'Today',
      dateFormat: 'yyyy-mm-dd',
      openSelectorTopOfInput: true,
      showSelectorArrow: false,
      editableDateField: false,
      openSelectorOnInputClick: true
  };
  //SAPMPLE TYPE
  sample_type: string = '-';
  form_filled: boolean = false;
  searchForm: FormGroup;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private localStorageService: LocalStorageService,
              private cValidators: CustomFormValidators, private fb: FormBuilder) { 
    appStore.subscribe(()=> this.updateState());
    this.updateState();
    this.all_sample_types = this.appSetting.SAMPLE_TYPE;
    this.sample_type = '-';

    //formGroup
    this.searchForm = fb.group({
      //general
      'container':[, ],
      'type':[, Validators.required],
      'name': [, ],
      'tag':[, ],
      'label':[, ],
      'registration_code':[, ],
      'reference_code':[, ],
      'freezing_code':[, ],
      'freezing_date_from':[, ],
      'freezing_date_to':[, ],
      //construct
      'feature': [, ],
      'backbone': [, ],
      'insert': [, ],
      'marker': [, ],
     
      //oligo
      'oligo_name': [, ],
      'oligo_length_from': [, ],
      'oligo_length_to': [, ],

      //virus
      'plasmid': [, ],
      'titration_code': [, ],
      
      //tissue
      'pathology_code': [, ],
      'tissue': [, ]
      });
  }
  updateContainer(value:any){
    this.container_to_search = value.target.value;
  }
  updateType(value:any){
    this.sample_type = value.target.value;
    console.log(this.sample_type);
  }
  updateSampleFromDate(value:any){
    this.freezing_date_from = value.formatted;
  }
  updateSampleToDate(value:any){
    this.freezing_date_to = value.formatted;
  }

  updateState(){
    let state = this.appStore.getState();
    if (state.containerInfo && state.containerInfo.currentContainer){
      this.container = state.containerInfo.currentContainer;
    }
    if (state.containerInfo && state.containerInfo.containers){
      this.containers = state.containerInfo.containers;
    }
    this.container_name_pks = this.getContainerNamePks(this.containers);
  }

  getContainerNamePks(containers: Array<Container>): Array<ContainerNamePK>{
    let array_name_pks: Array<ContainerNamePK> = new Array<ContainerNamePK>();
    containers.forEach((c, i)=>{
      let name_pk: ContainerNamePK = new ContainerNamePK();
      name_pk.name = c.name;
      name_pk.pk = c.pk;
      array_name_pks.push(name_pk);
    });
    return containers;
  }

  ngOnInit() {
    if(this.container != null){
      this.container_to_search = this.container.pk;
    }   
  }
  
}
