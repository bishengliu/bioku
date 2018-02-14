import { Component, OnInit, Inject, Input, Output, EventEmitter, SimpleChanges, OnChanges} from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { SampleSearch } from '../../_classes/Sample';
import { Container, ContainerNamePK } from '../../_classes/Container';
import {  LocalStorageService } from '../../_services/LocalStorageService';
import {  ContainerService } from '../../_services/ContainerService';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
// custom from validator
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';
// mydatepicker
import {IMyOptions} from 'mydatepicker';
//rxjs
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sample-search-form',
  templateUrl: './sample-search-form.component.html',
  styleUrls: ['./sample-search-form.component.css']
})
export class SampleSearchFormComponent implements OnInit, OnChanges {
  @Output() searchObj: EventEmitter<SampleSearch> = new EventEmitter<SampleSearch> ();
  @Input() searchAgain;
  container: Container = new Container();
  containers: Array<Container> = new Array<Container>();
  container_to_search: Number = null;
  show_form: boolean;
  // show_button: boolean;
  default_container_to_search: Number = -1;
  // all the containers
  container_name_pks: Array<ContainerNamePK> = new Array<ContainerNamePK>();
  // ALL SAMPLE TYPES
  all_sample_types: Array<String> = new Array<String>();
  freezing_date_from: string = null;
  freezing_date_to: string = null;
  // mydatepicker
  private myDatePickerOptions: IMyOptions = {
      // other options...
      todayBtnTxt: 'Today',
      dateFormat: 'yyyy-mm-dd',
      openSelectorTopOfInput: true,
      showSelectorArrow: false,
      editableDateField: false,
      openSelectorOnInputClick: true
  };
  // SAPMPLE TYPE
  sample_type: String = '';
  sample_types: Array<String> = new Array<String>();
  // sample presearch count
  presearch_sample_count: Number = -1;
  searchForm: FormGroup;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
              private localStorageService: LocalStorageService, private containerService: ContainerService,
              private cValidators: CustomFormValidators, private fb: FormBuilder) {
    appStore.subscribe(() => this.updateState());
    this.updateState();
    this.all_sample_types = this.appSetting.SAMPLE_TYPE;
    this.sample_type = '';
    this.show_form = true;
    // this.show_button = false;
    // formGroup
    this.searchForm = fb.group({
      // general
      'container': [, Validators.required],
      'type': [, ],
      'name': [, ],
      'tag': [, ],
      'label': [, ],
      'registration_code': [, ],
      'reference_code': [, ],
      'freezing_code': [, ],
      'freezing_date_from': [, ],
      'freezing_date_to': [, ],
      'occupied': [, Validators.required],
      // construct
      'feature': [, ],
      'backbone': [, ],
      'insert': [, ],
      'marker': [, ],

      // oligo
      'oligo_name': [, ],
      'oligo_length_from': [, ],
      'oligo_length_to': [, ],

      // virus
      'plasmid': [, ],
      'titration_code': [, ],

      // tissue
      'pathology_code': [, ],
      'tissue': [, ]
      });
      // watch form changes
    this.searchForm.valueChanges
    .mergeMap((data: SampleSearch) => {
      if (data.occupied === null ) {
        return Observable.of({'count': 0 });
      } else {
        return this.containerService.PreSearchSample(data);
      }
    })
    .subscribe(
      (res: any) => { this.presearch_sample_count = res.count; console.log(this.presearch_sample_count) },
      () => { this.presearch_sample_count = 0; }
    );
  }

  updateContainer(value: any) {
    this.container_to_search = value.target.value;
  }
  updateType(value: any) {
    // console.log(value);
    this.sample_types = value;
    // this.sample_type = value.target.value;
  }
  updateSampleFromDate(value: any) {
    this.freezing_date_from = value.formatted;
  }

  updateSampleToDate(value: any) {
    this.freezing_date_to = value.formatted;
  }

  updateState() {
    const state = this.appStore.getState();
    if (state.containerInfo && state.containerInfo.currentContainer) {
      this.container = state.containerInfo.currentContainer;
    }
    if (state.containerInfo && state.containerInfo.containers) {
      this.containers = state.containerInfo.containers;
    }
    this.container_name_pks = this.getContainerNamePks(this.containers);
    // console.log(this.container);
  }

  getContainerNamePks(containers: Array<Container>): Array<ContainerNamePK> {
    const array_name_pks: Array<ContainerNamePK> = new Array<ContainerNamePK>();
    containers.forEach((c, i) => {
      const name_pk: ContainerNamePK = new ContainerNamePK();
      name_pk.name = c.name;
      name_pk.pk = c.pk;
      array_name_pks.push(name_pk);
    });
    return containers;
  }

  ngOnInit() {}

  onSearch(values: SampleSearch) {
    // console.log(values);
    // need to update search obj
    values.freezing_date_from = this.freezing_date_from;
    values.freezing_date_to = this.freezing_date_to;
    this.searchObj.emit(values);
    this.show_form = false;
    // this.show_button = true;
  }

  ngOnChanges(change: SimpleChanges) {
    if (change['searchAgain'] !== undefined) {
      this.show_form = true;
    }
  }

}
