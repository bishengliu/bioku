import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { UtilityService } from '../../_services/UtilityService';
import { BoxLabel } from '../../_classes/sampleUpload';

@Component({
  selector: 'app-container-sample-uploader-step-one',
  templateUrl: './container-sample-uploader-step-one.component.html',
  styleUrls: ['./container-sample-uploader-step-one.component.css']
})
export class ContainerSampleUploaderStepOneComponent implements OnInit {

  @Output() activeStep: EventEmitter<number> = new EventEmitter<number> ();
  bLabel: BoxLabel = new BoxLabel();
  @Output() boxLabel: EventEmitter<BoxLabel> = new EventEmitter<BoxLabel> ();

  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService, ) {
  }
  ngOnInit() {
    this.bLabel = new BoxLabel();
    this.setDefaultBoxLabel();
    // this.updateBoxLabel();
  }
  // step 1
  updatebLabel(evt: any, type: string) {
    this.bLabel[type] = evt;
  }
  toggleBoxPositionDefinition() {
    this.bLabel.box_defined_as_normal = !this.bLabel.box_defined_as_normal;
  }
  toggleBoxTSBColumn() {
    this.bLabel.box_tsb_one_column = !this.bLabel.box_tsb_one_column;
  }
  toggleBoxSampleSeparated() {
    this.bLabel.box_sample_separated = !this.bLabel.box_sample_separated;
  }
  saveFirstStep() {
    this.activeStep.emit(2);
    this.boxLabel.emit(this.bLabel);
  }
  setDefaultBoxLabel() {
    this.bLabel.appendix = '';
    this.bLabel.prefix = '';
    this.bLabel.join = '-';
    this.bLabel.tower = 1;
    this.bLabel.shelf = 1;
    this.bLabel.box = 1;
    this.bLabel.box_defined_as_normal = true;
    this.bLabel.box_tsb_one_column = true;
    this.bLabel.box_sample_separated = true;
  }
}
