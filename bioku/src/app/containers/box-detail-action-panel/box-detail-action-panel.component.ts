import { Component, OnInit, OnChanges, Inject, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting } from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { Sample } from '../../_classes/Sample';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType } from '../../_classes/CType';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { ContainerService } from '../../_services/ContainerService';
import { AlertService } from '../../_services/AlertService';
import { LocalStorageService } from '../../_services/LocalStorageService';
import { CTypeService } from '../../_services/CTypeService';
import { UtilityService } from '../../_services/UtilityService';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';

@Component({
  selector: 'app-box-detail-action-panel',
  templateUrl: './box-detail-action-panel.component.html',
  styleUrls: ['./box-detail-action-panel.component.css']
})
export class BoxDetailActionPanelComponent implements OnInit, OnChanges {
  @Input() selectedSamples: string;
  // convert it to string in the parent cmp and force triger the ngOnChanges() detection in this cmp;
  // if set to array the ngOnChanges() won't be triggered
  @Input() selectedCells: string; // same as above
  samplePKs: Array<number> = []; // real sample pk array selected
  cells: Array<string> = []; // real cells selected
  user: User;
  appUrl: string;
  @Input() container: Container = null;
  @Input() box: Box = null;
  action_panel_msg: string= null;
  occupiedSamples = []; // occupied samples: Array<Sample> or Array<CSample>
  preoccupiedSamples= []; // previous occupied samples, Array<Sample> or Array<CSample>
  emptySelectedCells: Array<string> = []; // selected cells that are empty
  show_panel_content: Boolean = false;
  USE_CSAMPLE = true;
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
              private localStorageService: LocalStorageService, private containerService: ContainerService,
              private alertService: AlertService, private router: Router, private route: ActivatedRoute) {
    this.appUrl = this.appSetting.URL;
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
    // subscribe store state changes
    appStore.subscribe(() => this.updateState());
    this.updateState();
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
      // this.boxDescription = this.box.description;
    }
  }

  // find the samples from selected pks
  findSamples(pks: Array<number>) {
    let samples = [];
    if (pks != null && pks.length > 0) {
      samples = this.USE_CSAMPLE
      ? this.box.csamples.filter((s: CSample) => pks.indexOf(+s.pk) !== -1)
      : this.box.samples.filter((s: Sample) => pks.indexOf(+s.pk) !== -1);
    }
    return samples;
  }

  // check whether a cell has a sample
  checkSamplebyCell(cell: string) {
    const findSamples =
    this.USE_CSAMPLE
    ? this.occupiedSamples.filter((s: CSample) => s.position.toLowerCase() === cell.toLowerCase())
    : this.occupiedSamples.filter((s: Sample) => s.position.toLowerCase() === cell.toLowerCase());
    return (findSamples != null && findSamples.length > 0) ? true : false;
  }

  // store new samples into the box
  storeSamples() {
    this.localStorageService.curContainer = this.container;
    this.localStorageService.curBox = this.box;
    this.localStorageService.allCellsSelected = this.cells;
    this.localStorageService.emptySelectedCells = this.emptySelectedCells;
    this.localStorageService.occupiedSamples = this.occupiedSamples;
    this.localStorageService.preoccupiedSamples = this.preoccupiedSamples;
    this.localStorageService.singleSample = null;
    // route to move sample cmp
    this.router.navigate(['/containers/', this.container.pk, this.box.box_position, 'store_samples']);
  }

  // put multiple sample back
  putMultipleSampleBack() {
    // console.log(this.preoccupiedSamples);
    let failed_samples = '';
    // tslint:disable-next-line:no-inferrable-types
    let count: number = 0;
    if (this.preoccupiedSamples.length > 0) {
      let sample_put_back: Boolean = true;
      this.preoccupiedSamples.forEach((sample, i) => {
        count++;
        this.containerService.putSampleBack(this.container.pk, this.box.box_position, sample.position)
        .subscribe(() => {
          if (count === this.preoccupiedSamples.length) {
            if (sample_put_back) {
              this.alertService.success('All samples put back!', true);
            }
            this.forceRefresh();
          }
        }, (err) => {
          console.log(err);
          sample_put_back = false;
          failed_samples = sample.position + ' ';
          if (count === this.preoccupiedSamples.length) {
            this.alertService.error('Something went wrong, failed to put back samples at: ' + failed_samples + '!', true);
            this.forceRefresh();
          }
        });
      });
    }
  }

  // take multiple sample out
  takeMultipleSampleout() {
    const today = new Date()
    const date_out = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let failed_samples = '';
    // tslint:disable-next-line:no-inferrable-types
    let count: number = 0;
    if (this.occupiedSamples.length > 0) {
      let sample_token_out: Boolean = true;
      this.occupiedSamples.forEach((sample, i) => {
        count++;
        this.containerService.takeSampleOut(this.container.pk, this.box.box_position, sample.position)
          .subscribe(() => {
            if (count === this.occupiedSamples.length) {
              if (sample_token_out) {
                this.alertService.success('All samples token out!', true);
              }
              this.forceRefresh();
            }
          }, (err) => {
            sample_token_out = false;
            console.log(err);
            failed_samples = sample.position + ' ';
            if (count === this.occupiedSamples.length) {
              this.alertService.error('Something went wrong, failed to take out samples at: ' + failed_samples + '!', true);
              this.forceRefresh();
            }
          });
      });
    }
  }

  // switch samples
  switch2Samples() {
    if (this.occupiedSamples.length === 2) {
      const first_sample_position = this.occupiedSamples[0].position;
      const second_sample_position = this.occupiedSamples[1].position;
      this.containerService.switchSamplePosition(this.container.pk, this.box.box_position, first_sample_position, second_sample_position)
      .subscribe(() => {
        this.alertService.success('Samples posiitons were switched!', true);
        this.router.navigate(['/containers', this.container.pk], { queryParams: { 'box_position': this.box.box_position } });
      }, () => {
        this.alertService.error('Something went wrong, samples were not switched!', true);
        this.router.navigate(['/containers', this.container.pk], { queryParams: { 'box_position': this.box.box_position } });
      });
    } else {
      this.alertService.error('Something went wrong, can only switch on 2 samples!', true);
    }
  }

  ngOnInit() {}

  ngOnChanges() {
    // samples
    this.samplePKs = [];
    if (this.selectedSamples != null && this.selectedSamples !== '') {
      const sArray = this.selectedSamples.split(',');
      for (let i = 0; i < sArray.length; i++) {
        if (!isNaN(+sArray[i])) {
          this.samplePKs.push(+sArray[i]); }
        }
      // more sample selects
      if (this.samplePKs != null && this.samplePKs.length >= 1) {
        const samples = this.findSamples(this.samplePKs);
        // console.log(samples);
        this.occupiedSamples = this.USE_CSAMPLE
      ? samples.filter((s: CSample) => s.occupied === true && s.date_out == null)
      : samples.filter((s: Sample) => s.occupied === true && s.date_out == null);
        this.preoccupiedSamples = this.USE_CSAMPLE
      ? samples.filter((s: CSample) => s.occupied !== true && s.date_out != null)
      : samples.filter((s: Sample) => s.occupied !== true && s.date_out != null);
      }
    }
    // positions
    this.cells = [];
    if (this.selectedCells != null && this.selectedCells !== '') {
      this.cells = this.selectedCells.split(',');
    }
    // get positions that are not occupied
    this.emptySelectedCells = this.cells.filter((cell: string) => !this.checkSamplebyCell(cell));
  }

  // route force refrsh
  forceRefresh() {
    this.router.navigate(['/containers', this.container.pk], { queryParams: { 'box_position': this.box.box_position } });
  }

  hidePanelContent() {
    this.show_panel_content = false;
  }

  showPanelContent() {
    this.show_panel_content = true;
  }

  togglePanelContent() {
    this.show_panel_content = !this.show_panel_content;
  }
}
