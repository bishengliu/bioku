import { Component, OnInit, Inject, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG} from '../../_providers/AppSettingProvider';
import { SampleSearch } from '../../_classes/Sample';
import { Container, ContainerNamePK } from '../../_classes/Container';
import { LocalStorageService } from '../../_services/LocalStorageService';
import { ContainerService } from '../../_services/ContainerService';
import { CTypeService } from '../../_services/CTypeService';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType, CSubAttrData } from '../../_classes/CType';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
// custom from validator
import { CustomFormValidators } from '../../_helpers/CustomFormValidators';
// mydatepicker
import {IMyOptions} from 'mydatepicker';
// rxjs
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sample-search-form',
  templateUrl: './sample-search-form.component.html',
  styleUrls: ['./sample-search-form.component.css']
})
export class SampleSearchFormComponent implements OnInit, OnChanges {
  @Output() searchObj: EventEmitter<Object> = new EventEmitter<Object> ();
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
  all_ctypes: Array<CType> = new Array<CType>();
  extra_attrs: Array<String> = new Array<String>();
  left_extra_attrs: Array<Array<String>> = new Array<Array<String>> ();
  right_extra_attrs: Array<Array<String>> = new Array<Array<String>> ();
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
  sample_types: Array<string> = new Array<string>();
  // sample presearch count
  presearch_sample_count: Number = -1;
  searchForm: FormGroup;
  // CUSTOM SAMPEL CODE NAME
  custom_sample_code_name = 'sample code';
  USE_CSAMPLE = true;
  // SHOW COMMON ATTRS
  DISPLAY_COMMON_ATTRS = true;
  fb_group_controlsConfig = {};
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private ctypeService: CTypeService,
              private localStorageService: LocalStorageService, private containerService: ContainerService,
              private cValidators: CustomFormValidators, private fb: FormBuilder) {
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
    this.DISPLAY_COMMON_ATTRS = this.appSetting.DISPLAY_COMMON_ATTRS;
    appStore.subscribe(() => this.updateState());
    this.updateState();
    if (this.USE_CSAMPLE) {
      this.ctypeService.getCTypes()
      .subscribe((ctyes: Array<CType>) => {
          this.all_ctypes = ctyes;
          this.all_sample_types = [...ctyes.map((ctype: CType) => {return ctype.type})];
        },
        () => { this.all_sample_types = new Array<String>();
          this.all_ctypes = new Array<CType>();
        });
    } else {
      this.all_sample_types = this.appSetting.SAMPLE_TYPE;
    }
    this.sample_type = '';
    this.show_form = true;
    // this.show_button = false;
    this.custom_sample_code_name = this.appSetting.CUSTOM_SAMPLE_CODE_NAME.toLowerCase();
    // formGroup
    this.fb_group_controlsConfig = {
      'container': [ -1, Validators.required],
      'type': [, ],
      'name': [, ],
      'freezing_date_from': [, ],
      'freezing_date_to': [, ],
      'occupied': [ 0, Validators.required],
      'attachment': [, ]
    }
    // ctype
    this.searchForm = this.USE_CSAMPLE
    ?
    fb.group(this.fb_group_controlsConfig)
    :
    fb.group({
      // general
      'container': [ -1, Validators.required],
      'type': [, ],
      'name': [, ],
      'tag': [, ],
      'label': [, ],
      'registration_code': [, ],
      'reference_code': [, ],
      'freezing_code': [, ],
      'freezing_date_from': [, ],
      'freezing_date_to': [, ],
      'occupied': [ 0, Validators.required],
      'attachment': [, ],
      'description': [, ],
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
    this.preSearch();
  }

  updateContainer(value: any) {
    this.container_to_search = value.target.value;
  }

  updateType(value: any) {
    if (this.USE_CSAMPLE) {
      // console.log(value);
      this.sample_types = value;
      // this.sample_type = value.target.value;
      // FIND EXTRA SAMPLE ATTRS
      this.extra_attrs = this.getExtraAttrs(this.sample_types, this.all_ctypes);
      // get current form values
      const fb_values = this.searchForm.value;
      // update fromgroup
      this.searchForm = this.updateFormGroup(this.fb, fb_values, this.extra_attrs, this.fb_group_controlsConfig);
      // watch form changes
      this.preSearch();
      // format left and right extra attrs
      [this.left_extra_attrs, this.right_extra_attrs] = this.updateLeftRightExtraAttrs(this.extra_attrs);
    }
  }
  // pre sample search
  preSearch() {
    // watch form changes
    this.searchForm.valueChanges
    .do(() => {
      this.presearch_sample_count = 0;
    })
    .mergeMap((data: any) => {
      if (!this.searchForm.touched) {
        return Observable.of({'count': 0 });
      } else {
        // update dates
        data.freezing_date_from = this.freezing_date_from;
        data.freezing_date_to = this.freezing_date_to;
        return this.containerService.PreSearchSample(data);
      }
    })
    .subscribe((res: any) => { this.presearch_sample_count = res.count; },
      () => { this.presearch_sample_count = 0; });
  }
  // update left and right extra attrs
  updateLeftRightExtraAttrs(extra_attrs: Array<String>) {
    const left_extra_attrs: Array<Array<String>> = new Array<Array<String>>();
    const right_extra_attrs: Array<Array<String>> = new Array<Array<String>>();
    const len = extra_attrs.length;
    if (len > 0) {
      if (len === 1 ) {
        const lattrs = new Array<String>();
        lattrs.push(extra_attrs[0])
        left_extra_attrs.push(lattrs);
      } else if ( len === 2) {
        const lattrs = new Array<String>();
        lattrs.push(extra_attrs[0])
        lattrs.push(extra_attrs[1])
        left_extra_attrs.push(lattrs);
      } else {
        const half = Math.floor(len / 2);
        const remainder = len % 2;
        const middel = remainder === 0 ? half - 1 : half;
        // left
        for (let l = 0; l <= middel; l++ ) {
          if ( l % 2 === 0 || left_extra_attrs[((l - 1 ) / 2)] === undefined) {
            const lattrs = new Array<String>();
            lattrs.push(extra_attrs[l])
            left_extra_attrs.push(lattrs);
          } else {
            left_extra_attrs[((l - 1 ) / 2)].push(extra_attrs[l]);
          }
        }
        // right
        for (let r = 0; r < len - (middel + 1); r++ ) {
          if (r % 2 === 0 || right_extra_attrs[((r - 1 ) / 2)] === undefined) {
            const rattrs = new Array<String>();
            rattrs.push(extra_attrs[r + middel + 1])
            right_extra_attrs.push(rattrs);
          } else {
            right_extra_attrs[((r - 1 ) / 2)].push(extra_attrs[r + middel + 1]);
          }
        }
      }
    }
    return [left_extra_attrs, right_extra_attrs];
  }
  // update formbuilder
  updateFormGroup(fb: FormBuilder, fb_values: Array<string>, extra_attrs: Array<String>, fb_group_controlsConfig: any) {
    fb_group_controlsConfig = {
      'container': [ (fb_values['container'] !== undefined ? +fb_values['container'] : -1), Validators.required],
      'type': [, ],
      'name': [(fb_values['name'] !== undefined ? fb_values['name'] : null), ],
      'freezing_date_from': [, ],
      'freezing_date_to': [, ],
      'occupied': [ (fb_values['occupied'] !== undefined && +fb_values['occupied'] === 0 ? 0 : 1), Validators.required],
      'attachment': [(fb_values['attachment'] !== undefined ? fb_values['attachment'] : null), ]
    }
    // update fb
    const keys: Array<string> = Object.keys(fb_values);
    extra_attrs.forEach((attr: string) => {
      const obj = {};
      if (keys.indexOf(attr) === -1) {
        obj[attr] = [, ];
        fb_group_controlsConfig = Object.assign({}, fb_group_controlsConfig, obj);
      } else {
        obj[attr] = [fb_values[attr], ];
        fb_group_controlsConfig = Object.assign(fb_group_controlsConfig, obj);
      }
    })
    return fb.group(fb_group_controlsConfig);
  }

  getExtraAttrs(sample_types: Array<string>, all_ctypes: Array<CType>) {
    // get the relavent ctypes
    // excldue dates
    const exclude_date = true;
    const ctypes: Array<CType> = this.ctypeService.getCTypesByNames(sample_types, all_ctypes);
    if (this.DISPLAY_COMMON_ATTRS) {
      return this.ctypeService.getMaxAttrs(ctypes, exclude_date);
    } else {
      return this.ctypeService.getMaxAttrs(ctypes, exclude_date);
    }
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

  onSearch(values: any) {
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
