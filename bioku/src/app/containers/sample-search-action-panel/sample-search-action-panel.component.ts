import { Component, OnInit, OnChanges, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Sample } from '../../_classes/Sample';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType } from '../../_classes/CType';
import { ContainerService } from '../../_services/ContainerService';
import { AlertService } from '../../_services/AlertService';
import { CTypeService } from '../../_services/CTypeService';
import { AppSetting } from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { UtilityService } from '../../_services/UtilityService';
@Component({
  selector: 'app-sample-search-action-panel',
  templateUrl: './sample-search-action-panel.component.html',
  styleUrls: ['./sample-search-action-panel.component.css']
})
export class SampleSearchActionPanelComponent implements OnInit, OnChanges {
  @Input() selectedSamples = []; // Array<Sample> or Array<CSample>
  @Input() selectedSamplePks: Array<number>;
  // FOR RENDERING SAMPLE NAME
  SHOW_ORIGINAL_NAME: false;
  NAME_MIN_LENGTH: 15;
  NAME_MIN_right_LENGTH: 10;
  NAME_SYMBOL: '...';
  occupiedSamples= []; // Array<Sample> or Array<CSample>
  preoccupiedSamples = []; // Array<Sample> or Array<CSample>
  // show panel content
  show_panel_content: Boolean = false;
  USE_CSAMPLE = true;
  constructor(private router: Router, private containerService: ContainerService, private alertService: AlertService,
    @Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService) {
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
    this.SHOW_ORIGINAL_NAME = this.appSetting.SHOW_ORIGINAL_NAME;
    this.NAME_MIN_LENGTH = this.appSetting.NAME_MIN_LENGTH;
    this.NAME_MIN_right_LENGTH = this.appSetting.NAME_MIN_right_LENGTH;
    this.NAME_SYMBOL = this.appSetting.NAME_SYMBOL;
   }

  ngOnInit() {
  }

  splitSample() {
    if (this.selectedSamples != null && this.selectedSamplePks != null) {
      this.occupiedSamples = this.selectedSamples
      .filter((s: Sample | CSample) => s.occupied === true && s.date_out == null);
      this.preoccupiedSamples = this.selectedSamples
      .filter((s: Sample | CSample) => s.occupied !== true && s.date_out !== null);
    }
  }

  ngOnChanges() {
    this.splitSample();
    // console.log(this.selectedSamples);
    // console.log(this.selectedSamplePks);
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

  // take multiple sample out
  takeMultipleSampleout() {
    const today = new Date()
    const date_out = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let failed_samples = '';
    let count = 0;
    const total = this.occupiedSamples.length;
    if (total > 0) {
      let sample_token_out: Boolean = true;
      this.occupiedSamples.forEach((sample, i) => {
        count++;
        this.containerService.takeSampleOut(sample.container_id, sample.box_position, sample.position)
          .subscribe(() => {
            sample.occupied = false;
            if (count === total) {
              if (sample_token_out) {
                this.alertService.success('All samples token out!', true);
              }
              this.updateTakeoutSample(sample);
            }
          }, (err) => {
            sample_token_out = false;
            console.log(err);
            failed_samples = sample.box + '/' + sample.position;
            if (count === total) {
              this.alertService.error('Something went wrong, failed to take out samples at: ' + failed_samples + '!', true);
            }
          });
      });
    }
  }

  updateTakeoutSample(sample: Sample | CSample) {
    this.occupiedSamples = [...this.occupiedSamples
      .filter((s: Sample | CSample) => { return s.pk !== sample.pk })];
    this.preoccupiedSamples = [...this.preoccupiedSamples, sample];
  }

  // put multiple sample back
  putMultipleSampleBack() {
    // console.log(this.preoccupiedSamples);
    let failed_samples = '';
    let count = 0;
    const total = this.preoccupiedSamples.length;
    if (total > 0) {
      let sample_put_back: Boolean = true;
      this.preoccupiedSamples.forEach((sample, i) => {
        count++;
        this.containerService.putSampleBack(sample.container_id, sample.box_position, sample.position)
          .subscribe(() => {
            sample.occupied = true;
            if (count === total) {
              if (sample_put_back) {
                this.alertService.success('All samples put back!', true);
              }
              this.updatePutBackSample(sample);
            }
          }, (err) => {
            console.log(err);
            sample_put_back = false;
            failed_samples = sample.box + '/' + sample.position;
            if (count === total) {
              this.alertService.error('Something went wrong, failed to put back samples at: ' + failed_samples + '!', true);
            }
          });
      });
    }
  }

  updatePutBackSample(sample: Sample | CSample) {
    this.preoccupiedSamples = [...this.preoccupiedSamples
      .filter((s: Sample | CSample) => { return s.pk !== sample.pk })];
    this.occupiedSamples = [...this.occupiedSamples, sample];
  }

  // render sample name
  renderSampleName(samplename: string) {
    return this.utilityService.renderSampleName(samplename, this.SHOW_ORIGINAL_NAME,
      this.NAME_MIN_LENGTH, this.NAME_MIN_right_LENGTH, this.NAME_SYMBOL);
  }

  // gen query param for box layout
  getQueryParams(name: string) {
    return {'query': name.toLowerCase() }
  }
}
