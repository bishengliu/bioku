import { Component, OnInit, OnChanges, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
// color picker
import { IColorPickerConfiguration } from 'ng2-color-picker';

import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { Sample, Attachment } from '../../_classes/Sample';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType } from '../../_classes/CType';
import {  ContainerService } from '../../_services/ContainerService';
import { CTypeService } from '../../_services/CTypeService';
import {  UtilityService } from '../../_services/UtilityService';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
@Component({
  selector: 'app-sample-table',
  templateUrl: './sample-table.component.html',
  styleUrls: ['./sample-table.component.css']
})
export class SampleTableComponent implements OnInit, OnChanges {
  @Input() samples = []; // sample of csample;
  selectedSamples: Array<number> = [] // sample pk
  @Output() sampleSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>> ();
  @Output() sampleDbClicked: EventEmitter<number> = new EventEmitter<number> ();
  appUrl: string;
  @Input() container: Container;
  @Input() box: Box;
  currentSampleCount = 0; // active samples in the box
  totalBoxCapacity: number;
  user: User;
  rate = 0;
  color = '#ffffff'; // box color
  // CUSTOM SAMPEL CODE NAME
  custom_sample_code_name = 'sample code';
  // color picker
  availableColors: Array<string> = [];
  pickerOptions: IColorPickerConfiguration = {
    width: 25,
    height: 25,
    borderRadius: 4};
  // FOR RENDERING SAMPLE NAME
  SHOW_ORIGINAL_NAME: false;
  NAME_MIN_LENGTH: 15;
  NAME_MIN_right_LENGTH: 10;
  NAME_SYMBOL: '...';
  //all ctypes
  all_ctypes: Array<CType> = new Array<CType>();
  // sample types in the box
  sample_types: Array<string> = [];
  // sample common attrs 
  sample_common_attrs: Array<string> = [];
  // sample all attrs 
  sample_all_attrs: Array<string> = [];
  // displayed attrs
  sample_attrs: Array<string> = [];
  // all_sample_types: Array<string> = [];
  USE_CSAMPLE = true;
  //SHOW COMMON ATTRS
  DISPLAY_COMMON_ATTRS = true;
  // samples for display
  displayed_samples: Array<any> = [];
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private ctypeService: CTypeService,
              private containerService: ContainerService, private utilityService: UtilityService) {
    this.appUrl = this.appSetting.URL;
    this.availableColors = this.appSetting.APP_COLORS;
    // for redering sample name
    this.SHOW_ORIGINAL_NAME = this.appSetting.SHOW_ORIGINAL_NAME;
    this.NAME_MIN_LENGTH = this.appSetting.NAME_MIN_LENGTH;
    this.NAME_MIN_right_LENGTH = this.appSetting.NAME_MIN_right_LENGTH;
    this.NAME_SYMBOL = this.appSetting.NAME_SYMBOL;
    this.custom_sample_code_name = this.appSetting.CUSTOM_SAMPLE_CODE_NAME;
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
    this.DISPLAY_COMMON_ATTRS = this.appSetting.DISPLAY_COMMON_ATTRS;
    //get all the ctypes
    this.ctypeService.getCTypes().subscribe(
      (ctypes: Array<CType>) => { this.all_ctypes = ctypes; },
      () => { this.DISPLAY_COMMON_ATTRS = false;})
    // subscribe store state changes
    appStore.subscribe(() => this.updateState());
    this.updateState();
  }

  toggleSelection(pk: number) {
    if (pk != null) {
      const index = this.selectedSamples.indexOf(pk);
      if (index === -1) {
        this.selectedSamples.push(pk);
      } else {
        this.selectedSamples.splice(index, 1);
      }
    }
    // emit observable
    this.sampleSelected.emit(this.selectedSamples);
  }
  // display sample details upon dbclick
  dbClickSample(sample: Sample | CSample) {
    if (sample !== undefined && sample !== null && sample.pk) {
      this.sampleDbClicked.emit(sample.pk);
    }
    // console.log(sample);
  }
  renderSampleName(sampleName: string) {
    return this.utilityService.renderSampleName(sampleName, this.SHOW_ORIGINAL_NAME,
      this.NAME_MIN_LENGTH, this.NAME_MIN_right_LENGTH, this.NAME_SYMBOL);
  }
  updateState() {
    const state = this.appStore.getState();
    if (state.authInfo && state.authInfo.authUser) {
      this.user = state.authInfo.authUser;
    }
    if (state.containerInfo && state.containerInfo.currentContainer) {
      this.container = state.containerInfo.currentContainer;
    }
    if (state.containerInfo && state.containerInfo.currentBox) {
      this.box = state.containerInfo.currentBox;
    }
  }

  genBorderStyle(color: string) {
    let cssValue = '1px solid rgba(34,36,38,.15)';
    if (color !== null && color !== '') {
      cssValue = '3px solid ' + color;
    }
    return cssValue;
  }
  // rate box
  updateRate(rate: number, box_position: string) {
    this.rate = rate;
    this.containerService.updateBoxRate(this.container.pk, box_position, rate)
    .subscribe(() => {}, (err) => console.log(err));
  }
  clearRate(box_position: string) {
    this.containerService.updateBoxRate(this.container.pk, box_position, 0)
    .subscribe(() => this.rate = 0, (err) => console.log(err));
  }
  // update box color
  updateColor(color: string, box_position: string) {
    this.color = color;
    this.containerService.updateBoxColor(this.container.pk, box_position, color)
    .subscribe(() => {}, (err) => console.log(err));
  }
  // update description
  updateDescription(text: string, box_position: string) {
    this.containerService.updateBoxDescription(this.container.pk, box_position, text)
    .subscribe(() => {}, (err) => console.log(err));
  }
  // update box label
  updateLabel(text: string, box_position: string) {
    this.containerService.updateBoxLabel(this.container.pk, box_position, text)
    .subscribe(() => {}, (err) => console.log(err));
  }
  ngOnInit() {
    this.sampleSelected.emit([]); // emit empty sample selected
    if (this.box != null) {
      this.rate =  this.box.rate == null ? 0 : this.box.rate;
      this.color = this.box.color == null ? '#ffffff' : this.box.color;
      this.currentSampleCount =
      this.USE_CSAMPLE
      ? (this.box.csamples != null ? this.box.csamples.filter((s: CSample) => s.occupied === true).length : 0)
      : (this.box.samples != null ? this.box.samples.filter((s: Sample) => s.occupied === true).length : 0)
      this.totalBoxCapacity = this.box.box_vertical * this.box.box_horizontal;
    }
  }
  getSampleTypes() {
    this.sample_types = [];
    if (this.samples != null && this.samples.length > 0) {
      if (this.USE_CSAMPLE) {
        this.samples.forEach((s: CSample) => {
          if (s.ctype != null && s.ctype !== undefined && this.sample_types.indexOf(s.ctype.type) === -1) {
            this.sample_types.push(s.ctype.type);
          }
        })
      } else {
        this.samples.forEach((s: Sample) => {
          if (s.type != null && s.type !== undefined && this.sample_types.indexOf(s.type) === -1) {
            this.sample_types.push(s.type);
          }
        })
      }
    }
  }
  hasSample(sampleType: string) {
    return this.sample_types.indexOf(sampleType) === -1 ? false : true;
  }
  calColspan() {
    let colspan = 1;
    const general_count = this.USE_CSAMPLE ? 7 : 10;
    colspan += general_count;
    if (this.USE_CSAMPLE) {
      // calcu later
    } else {
      this.sample_types.indexOf('CONSTRUCT') !== -1 ?  colspan += 8 : colspan += 0;
      this.sample_types.indexOf('OLIGO') !== -1 || this.sample_types.indexOf('gRNA_OLIGO') !== -1 ?  colspan += 6 : colspan += 0;
      this.sample_types.indexOf('CELL') !== -1 ?  colspan += 3 : colspan += 0;
      this.sample_types.indexOf('VIRUS') !== -1 ?  colspan += 5 : colspan += 0;
      this.sample_types.indexOf('TISSUE') !== -1 ?  colspan += 2 : colspan += 0;
    }
    return colspan;
  }
  // sort samples
  sortSampleByPosition() {
    if (this.samples != null) {
      this.samples.sort(this.utilityService.sortArrayByMultipleProperty('vposition', 'hposition'));
    }
  }
  // get sample top level attrs
  genTableHeaders() {
    if (this.samples !== undefined && this.samples !== null) {
      if (this.USE_CSAMPLE) {
        // get basic attrs
        const ctype_basic_attrs: Array<CTypeAttr> = this.ctypeService.getBasicCTypeAttrs();
        ctype_basic_attrs.forEach((a: CTypeAttr) => {
          if (this.sample_attrs.indexOf(a.attr_label) === -1 && a.attr_label !== 'ATTACHMENTS') {
            this.sample_attrs.push(a.attr_label);
          }
        })
        const sampel_ctypes: Array<CType> = this.all_ctypes.filter((c: CType) => {
          return this.sample_types.indexOf(c.type) !== -1;
        })

        if(this.DISPLAY_COMMON_ATTRS) {
          // only display common samples
          sampel_ctypes.forEach((c: CType) => {
            c.attrs.forEach( (a: CTypeAttr) => {
              let is_common = true;
              sampel_ctypes.forEach((ct: CType) => {
                if(ct.attrs.findIndex((ca: CTypeAttr) => {
                  return ca.attr_label == a.attr_label
                }) === -1) {is_common = false; }
              });
              if(is_common) {
                this.sample_attrs.push(a.attr_label)
              }
            })
          })
        } else {
          // get all the possible attrs from different types
          this.samples.forEach((s: CSample) => {
            if (s.ctype != null && s.ctype.attrs != null) {
              s.ctype.attrs.forEach( (a: CTypeAttr) => {
                if (this.sample_attrs.indexOf(a.attr_label) === -1 ) {
                  this.sample_attrs.push(a.attr_label);
                }
              })
            }
          });
        }

      } else {
        this.samples.forEach((s: Sample) => {
          const attrs = Object.keys(s);
          this.sample_attrs = [...this.sample_attrs, ...attrs]
        });
      }
    }
  }

  // gen displayed_samples
  genDisplaySamples() {
    if (this.samples != null && this.sample_attrs != null) {
      if (this.USE_CSAMPLE) {
        this.samples.forEach((s: CSample) => {
          // add some pks
          const displayed_samples = {};
          displayed_samples['pk'] = s.pk;
          displayed_samples['box_id'] = s.box_id;
          displayed_samples['container_id'] = s.container_id;
          displayed_samples['color'] = s.color;
          displayed_samples['occupied'] = s.occupied;
          displayed_samples['researchers'] = s.researchers;
          displayed_samples['ctype_id'] = s.ctype_id; //
          displayed_samples['type'] = s.ctype.type;
          displayed_samples['date_in'] = s.date_in;
          displayed_samples['date_out'] = s.date_out;
          displayed_samples['hposition'] = s.hposition;
          displayed_samples['vposition'] = s.vposition;
          // get the basic attrs
          displayed_samples['CONTAINER'] = s.container;
          displayed_samples['BOX'] = s.box_position;
          displayed_samples['POSITION'] = s.position;
          displayed_samples['NAME'] = s.name;
          displayed_samples['STORAGE_DATE'] = s.storage_date;
          displayed_samples['ATTACHMENTS'] = s.attachments;
          this.sample_attrs.forEach((key: string) => {
            if (displayed_samples[key] === undefined) {
              const found_data: CSampleData = s.csample_data.find( (d: CSampleData) => {
                return d.ctype_attr.attr_label === key;
              })
              if (found_data !== undefined) {
                displayed_samples[key] = found_data.ctype_attr_value_part1 + found_data.ctype_attr_value_part2;
              } else {
                // check subdata
                const found_subdata: CSampleSubData = s.csample_subdata.find( (d: CSampleSubData) => {
                  return d.ctype_sub_attr.parent_attr === key.toLowerCase();
                })
                if (found_subdata !== undefined) {
                  displayed_samples[key] = found_subdata.ctype_sub_attr_value_part1 + found_subdata.ctype_sub_attr_value_part2;
                } else {
                  displayed_samples[key] = '';
                }
              }
            }
          })
          this.displayed_samples.push(displayed_samples);
        })
      } else {
        /////////////////////////////////////
      }
    }
  }
  ngOnChanges() {
    // sort samples
    this.sortSampleByPosition();
    // get the sample types
    this.getSampleTypes();
    // get table headers
    this.genTableHeaders();
    // process sample for display
    this.displayed_samples = [];
    // process sample according to the table headers
    this.genDisplaySamples();
    console.log(this.displayed_samples);
    // console.log('sample types', this.sample_types);
    this.selectedSamples = []; // clear selected samples
    this.sampleSelected.emit(null); // emit selected sample pk
  }
}
