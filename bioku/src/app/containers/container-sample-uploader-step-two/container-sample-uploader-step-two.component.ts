import { Component, OnInit, Inject, EventEmitter, Output, Input } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { UtilityService } from '../../_services/UtilityService';
import { SampleLabel, BoxLabel } from '../../_classes/sampleUpload';
@Component({
  selector: 'app-container-sample-uploader-step-two',
  templateUrl: './container-sample-uploader-step-two.component.html',
  styleUrls: ['./container-sample-uploader-step-two.component.css']
})
export class ContainerSampleUploaderStepTwoComponent implements OnInit {
  sampleLabelDefinition = 0; // row-column in on data column; 1: in 2 columns; 2: increasing numbers
  // samplePrefix = '';
  boxLabel = 0;
  boxJoin = '';
  sampleRow = 0;
  sampleColumn = 1;
  sampleJoin = '';
  // sampleAppendix = '';
  box_horizontal: number;
  hArray: Array<number> = new Array<number>();
  box_vertical: string;
  vArray: Array<string> = new Array<string>();

  @Output() activeStep: EventEmitter<number> = new EventEmitter<number> ();
  sLabel: SampleLabel = new SampleLabel();
  @Output() sampleLabel: EventEmitter<SampleLabel> = new EventEmitter<SampleLabel> ();
  @Input() bLabel: BoxLabel;
  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService, ) { }

  ngOnInit() {
    this.sLabel = new SampleLabel();
    this.setDefaultSampleLabel();
  }
  updateSampleLabelDefinition (evt: any) {
    this.sampleLabelDefinition = evt;
  }
  // updateSamplePrefix(evt: any) {
  //   this.samplePrefix = evt;
  // }
  updateBoxLabel(evt: any) {
    this.boxLabel = evt;
  }
  updateBoxJoin(evt: any) {
    this.boxJoin = evt;
  }
  updateSampleRow(evt: any) {
    this.sampleRow = evt;
  }
  updateSampleColumn(evt: any) {
    this.sampleColumn = evt;
  }
  updateSampleJoin(evt: any) {
    this.sampleJoin = evt;
  }
  // updateSampleAppendix(evt: any) {
  //   this.sampleAppendix = evt;
  // }

  backFirstStep() {
    this.activeStep.emit(1);
    this.setDefaultSampleLabel();
    this.sampleLabel.emit(this.sLabel);
  }
  saveSecondStep() {
    this.activeStep.emit(3);
    this.updateSampleLabel();
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
      this.box_horizontal = +event;
      this.hArray = this.utilityService.genArray(this.box_horizontal);

    }
    if (type === 'vertical') {
      this.box_vertical = event;
      this.vArray = this.appSetting.BOX_POSITION_LETTERS.slice(0, this.appSetting.BOX_POSITION_LETTERS.indexOf(this.box_vertical) + 1 );
    }
  }

  updateSampleLabel() {
    this.sLabel.sampleLabelDefinition = this.sampleLabelDefinition;
    this.sLabel.boxLabel = this.boxLabel;
    this.sLabel.boxJoin = this.boxJoin;
    this.sLabel.sampleRow = this.sampleRow;
    this.sLabel.sampleColumn = this.sampleColumn;
    this.sLabel.sampleJoin = this.sampleJoin;
    this.sLabel.box_horizontal = this.box_horizontal;
    this.sLabel.box_vertical = this.box_vertical;
  }

  setDefaultSampleLabel() {
    this.sampleLabelDefinition = 0;
    this.boxLabel = 0;
    this.boxJoin = '-';
    this.sampleRow = 0;
    this.sampleColumn = 1;
    this.sampleJoin = '';
    this.box_horizontal = this.appSetting.BOX_HORIZONTAL;
    this.box_vertical = this.appSetting.BOX_POSITION_LETTERS[this.appSetting.BOX_VERTICAL - 1]; // a letter
    this.hArray = this.utilityService.genArray(this.box_horizontal);
    this.vArray = this.appSetting.BOX_POSITION_LETTERS.slice(0, this.appSetting.BOX_POSITION_LETTERS.indexOf(this.box_vertical) + 1 );
    this.updateSampleLabel();
  }
  genOneorA(value: number) {
    if ( +value === 1) { return 1 } else { return 'A'; }
  }

  show2ColumnOption(): boolean {
    if (!this.bLabel.box_has_label) {
      return true;
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
}
