import { Component, OnInit, Inject, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { UtilityService } from '../../_services/UtilityService';
import { SampleLabel, BoxLabel } from '../../_classes/sampleUpload';
@Component({
  selector: 'app-container-sample-uploader-step-two',
  templateUrl: './container-sample-uploader-step-two.component.html',
  styleUrls: ['./container-sample-uploader-step-two.component.css']
})
export class ContainerSampleUploaderStepTwoComponent implements OnInit, OnChanges {
  hArray: Array<number> = new Array<number>();
  // box_vertical: string;
  vArray: Array<string> = new Array<string>();
  @Input() trigerChange;
  @Output() activeStep: EventEmitter<number> = new EventEmitter<number> ();
  sLabel: SampleLabel = new SampleLabel();
  @Output() sampleLabel: EventEmitter<SampleLabel> = new EventEmitter<SampleLabel> ();
  @Input() bLabel: BoxLabel;
  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService, ) {
    this.sLabel = new SampleLabel();
  }

  ngOnInit() {
    this.sLabel = new SampleLabel();
    this.setDefaultSampleLabel();
  }
  updateSampleLabelDefinition (evt: any) {
    this.sLabel.sampleLabelDefinition = evt;
    this.preventSameJoinSymbol();
  }

  updateBoxLabel(evt: any) {
    this.sLabel.boxLabel = evt;
  }
  updateBoxJoin(evt: any) {
    this.sLabel.boxJoin = evt;
    this.preventSameJoinSymbol();
  }
  updateSampleRow(evt: any) {
    this.sLabel.sampleRow = evt;
  }
  updateSampleColumn(evt: any) {
    this.sLabel.sampleColumn = evt;
  }
  updateSampleJoin(evt: any) {
    this.sLabel.sampleJoin = evt;
    this.preventSameJoinSymbol();
  }

  backFirstStep() {
    this.activeStep.emit(1);
    this.setDefaultSampleLabel();
    this.sampleLabel.emit(this.sLabel);
  }
  saveSecondStep() {
    this.activeStep.emit(3);
    this.sampleLabel.emit(this.sLabel);
  }

  // generate extra options for dropdow
  genVerticalOptions() {
    return [...this.vArray, ...this.appSetting.BOX_POSITION_LETTERS.slice(this.vArray.length,
            this.vArray.length + this.appSetting.BOX_EXTRA_LAYOYT)];
  }

  genHorizontalOptions() {
    return this.utilityService.genArray(this.hArray.length + this.appSetting.BOX_EXTRA_LAYOYT);
  }

  updateLayout(event: any, type: string, ) {
    // event is the value of changes
    if (type === 'horizontal') {
      this.sLabel.box_horizontal = +event;
      this.hArray = this.utilityService.genArray(this.sLabel.box_horizontal);

    }
    if (type === 'vertical') {
      this.sLabel.box_vertical = event;
      this.vArray = this.appSetting.BOX_POSITION_LETTERS
      .slice(0, this.appSetting.BOX_POSITION_LETTERS.indexOf(this.sLabel.box_vertical) + 1 );
    }
  }

  setDefaultSampleLabel() {
    this.sLabel.sampleLabelDefinition = 0;
    this.sLabel.boxLabel = 0;
    this.sLabel.boxJoin = '-';
    this.sLabel.sampleRow = 0;
    this.sLabel.sampleColumn = 1;
    this.sLabel.sampleJoin = '';
    this.sLabel.box_horizontal = this.appSetting.BOX_HORIZONTAL;
    this.sLabel.box_vertical = this.appSetting.BOX_POSITION_LETTERS[this.appSetting.BOX_VERTICAL - 1]; // a letter
    this.hArray = this.utilityService.genArray(this.sLabel.box_horizontal);
    this.vArray = this.appSetting.BOX_POSITION_LETTERS
    .slice(0, this.appSetting.BOX_POSITION_LETTERS.indexOf(this.sLabel.box_vertical) + 1 );
  }
  genOneorA(value: number) {
    if ( +value === 1) { return 1 } else { return 'A'; }
  }
  show1ColumnOption(): boolean {
    if (!this.bLabel.box_has_label) {
      return false;
    }
    return true;
  }
  show2ColumnOption(): boolean {
    if (!this.bLabel.box_has_label) {
      return false;
    } else {
      if (this.bLabel.box_defined_as_normal) {
        return true;
      }
      if (!this.bLabel.box_defined_as_normal && this.bLabel.box_sample_separated) {
        return true;
      }
    }
    return false;
  }
  preventSameJoinSymbol() {
    if (this.sLabel.sampleLabelDefinition === 0 && !this.bLabel.box_defined_as_normal && !this.bLabel.box_sample_separated) {
      // box_join and sample join cannot be the same
      if (this.sLabel.boxJoin === this.sLabel.sampleJoin) {
        this.sLabel.boxJoin = '-';
        this.sLabel.sampleJoin = '';
      }
    }
  }
  ngOnChanges () {
    if (!this.bLabel.box_has_label) {
      if (this.sLabel !== undefined) {
        this.sLabel.sampleLabelDefinition = 2;
      }
    }
  }
}
