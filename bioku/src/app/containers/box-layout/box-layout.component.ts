import { Component, OnInit, OnChanges, OnDestroy, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
// color picker
import { IColorPickerConfiguration } from 'ng2-color-picker';

import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { Sample, Attachment } from '../../_classes/Sample';
import { CSample, CAttachment } from '../../_classes/CType';
import {  ContainerService } from '../../_services/ContainerService';
import {  UtilityService } from '../../_services/UtilityService';
import {  AlertService } from '../../_services/AlertService';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
// dragula
import { DragulaService } from 'ng2-dragula/ng2-dragula';

@Component({
  selector: 'app-box-layout',
  templateUrl: './box-layout.component.html',
  styleUrls: ['./box-layout.component.css']
})
export class BoxLayoutComponent implements OnInit, OnChanges, OnDestroy {
  @Input() samples = []; // sample of csample
  @Input() searchedBoxSamples: Array<string> = []; // cell positions
  selectedSamples: Array<number> = []; // sample pk
  selectedCells: Array<string>= []; // cell position
  @Output() sampleSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>> ();
  @Output() cellSelected: EventEmitter<Array<string>> = new EventEmitter<Array<string>> ();
  @Output() sampleDbClicked: EventEmitter<number> = new EventEmitter<number> ();
  appUrl: string;
  @Input() container: Container;
  @Input() box: Box;
  // tslint:disable-next-line:no-inferrable-types
  currentSampleCount: number = 0; // active samples in the box
  totalBoxCapacity: number;
  user: User;
  isPIorAssist: Boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  rate: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  color: string = '#ffffff'; // box color
  // Box position letters
  box_letters: Array<string> = [];
  // color picker
  availableColors: Array<string> = [];
  pickerOptions: IColorPickerConfiguration = { width: 25, height: 25, borderRadius: 4};
  // box hArray and vArray
  hArray: Array<number> = [];
  vArray: Array<string> = [];
  // tfoot colspan
  // tslint:disable-next-line:no-inferrable-types
  colspanCount: number = 1;
  // dragular driective options
  private dragulaDrop$: any
  dragulaOptions: any = {
    revertOnSpill: true
  }
  // FOR RENDERING SAMPLE NAME
  SHOW_ORIGINAL_NAME: false;
  NAME_MIN_LENGTH: 15;
  NAME_MIN_right_LENGTH: 10;
  NAME_SYMBOL: '...';
  // droping
  dropped: Boolean = false;
  USE_CSAMPLE = true;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
              private router: Router, private alertService: AlertService, private containerService: ContainerService,
              private utilityService: UtilityService, private dragulaService: DragulaService) {
    this.appUrl = this.appSetting.URL;
    this.availableColors = this.appSetting.APP_COLORS;
    this.box_letters = this.appSetting.BOX_POSITION_LETTERS;
    // for redering sample name
    this.SHOW_ORIGINAL_NAME = this.appSetting.SHOW_ORIGINAL_NAME;
    this.NAME_MIN_LENGTH = this.appSetting.NAME_MIN_LENGTH;
    this.NAME_MIN_right_LENGTH = this.appSetting.NAME_MIN_right_LENGTH;
    this.NAME_SYMBOL = this.appSetting.NAME_SYMBOL;
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
    // subscribe store state changes
    appStore.subscribe(() => this.updateState());
    this.updateState();
  }

  // dragula events
  private onDrop(source_slot: string, target_slot: string) {
    const source_sample_positions = source_slot.split('-');
    const target_sample_positions = target_slot.split('-');
    if (!this.dropped && source_sample_positions.length === 2 &&
        target_sample_positions.length === 2 && !isNaN(+target_sample_positions[1])) {
      this.containerService
      .updateSamplePosition(this.container.pk, this.box.box_position,
        source_sample_positions[0] + source_sample_positions[1],
        target_sample_positions[0], +target_sample_positions[1])
      .subscribe(() => {
        this.alertService.success('sample is moved to the new position!', true);
        this.dropped = true;
        this.forceRefresh();
      }, () => {
        this.alertService.error('Something went wrong, sample fails to move to the new position!', true);
        this.dropped = true;
        this.forceRefresh();
      });
    }
  }

  genLetterArray(num: number) {
    return this.box_letters.slice(0, num);
  }

  toggleSelection(h: number, v: string) {
    // all samples selected
    const filterSamples = this.samples.filter(
      (s: Sample | CSample) => s.occupied === true && s.position.toLowerCase() === (v + h).toLowerCase())
    if (filterSamples.length  > 0 ) {
      const index = this.selectedSamples.indexOf(filterSamples[0].pk);
      if (index === -1) {
        this.selectedSamples.push(filterSamples[0].pk);
      } else {this.selectedSamples.splice(index, 1); }
    }
    // all positions selected
    const pIndex = this.selectedCells.indexOf(v + h);
    if (pIndex === -1) {
        this.selectedCells.push(v + h);
      } else {
        this.selectedCells.splice(pIndex, 1); }
    // console.log(this.selectedCells);
    // console.log(this.selectedSamples);
    // emit observable
    this.sampleSelected.emit(this.selectedSamples);
    this.cellSelected.emit(this.selectedCells.sort());
  }

  updateState() {
    const state = this.appStore.getState();
    // check pi
    if (state.authInfo && state.authInfo.authUser) {
      this.user = state.authInfo.authUser;
      if (this.user && this.user.roles) {
        this.user.roles.forEach( (r, i) => {
          if (r.toLowerCase() === 'pi') {
            this.isPIorAssist = true;
          }
        })
      }
    }
    // check authGroup
    if (state.authInfo && state.authInfo.authGroup) {
        const authGroups = state.authInfo.authGroup;
        authGroups.forEach( group => {
          if (group.assistants) {
            group.assistants.forEach( assist => {
              if (assist.user_id === this.user.pk) {
                this.isPIorAssist = true; }
            })
          }
        })
    }
    if (state.containerInfo && state.containerInfo.currentContainer) {
      this.container = state.containerInfo.currentContainer;
    }
    if (state.containerInfo && state.containerInfo.currentBox) {
      this.box = state.containerInfo.currentBox;
    }
  }

  genBorderStyle(color: string) {
    let cssValue: String = '1px solid rgba(34,36,38,.15)';
    if (color != null) {
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

  pickerSamples(h: number, v: string):  Array<Sample> | Array<CSample> {
    return this.samples.filter((s) => s.occupied === true &&
                                              s.position.toLowerCase() === (v + h).toLowerCase())
  }
  // display sample details upon dbclick
  dbClickSample(h: number, v: string) {
    // find the sample of the position
    let sample_dbclicked = this.USE_CSAMPLE ? new CSample() : new Sample();
    const samples_picked = this.pickerSamples(h, v);
    if (samples_picked === undefined || samples_picked === null || samples_picked.length === 0) {
      sample_dbclicked = this.USE_CSAMPLE ? new CSample() : new Sample();
    } else {
      sample_dbclicked = samples_picked[0];
    }
    if (sample_dbclicked !== null && sample_dbclicked.pk) {
      this.sampleDbClicked.emit(sample_dbclicked.pk);
    }
  }
  // render sample name
  renderSampleName(sampleName: string) {
    return this.utilityService.renderSampleName(sampleName, this.SHOW_ORIGINAL_NAME,
      this.NAME_MIN_LENGTH, this.NAME_MIN_right_LENGTH, this.NAME_SYMBOL);
  }
  forceRefresh() {
    this.router.navigate(['/containers', this.container.pk], { queryParams: { 'box_position': this.box.box_position } });
  }

  ngOnInit() {
    this.sampleSelected.emit([]); // emit empty sample selected
    this.cellSelected.emit([]); // emit selected cells
    if (this.box != null) {
      this.rate =  this.box.rate == null ? 0 : this.box.rate;
      this.color = this.box.color == null ? '#000000' : this.box.color;
      this.currentSampleCount =
      this.USE_CSAMPLE
      ? (this.box.csamples != null ? this.box.csamples.filter((s: CSample) => s.occupied === true).length : 0)
      : (this.box.samples != null ? this.box.samples.filter((s: Sample) => s.occupied === true).length : 0)
      this.totalBoxCapacity = this.box.box_vertical * this.box.box_horizontal;
      this.hArray = this.utilityService.genArray(this.box.box_horizontal);
      this.vArray = this.genLetterArray(this.box.box_vertical);
      this.colspanCount = this.box.box_horizontal + 1;
    }
    // dragular
    this.dragulaDrop$ = this.dragulaService.drop.subscribe((value) => {
      // console.log(`drop: ${value[1]}`);
      // el, target, source, sibling
      const source_slot = value[3].attributes['position'].value;
      const target_slot = value[2].attributes['position'].value;
      // console.log([source_slot, target_slot]);
      this.onDrop(source_slot, target_slot);
    });
  }
  ngOnChanges() {
    // sample
    this.selectedSamples = []; // clear selected samples
    this.sampleSelected.emit([]); // emit selected sample pk
    // cells
    this.selectedCells = []; // clear selected cells
    this.cellSelected.emit([]); // emit selected cells
  }

  ngOnDestroy() {
    if (this.dragulaDrop$ !== undefined) {
      this.dragulaDrop$.unsubscribe();
    }
  }
}
