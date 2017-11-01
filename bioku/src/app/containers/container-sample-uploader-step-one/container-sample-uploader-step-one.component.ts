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

  box_defined_as_normal: Boolean = true;
  box_tsb_one_column: Boolean = true; // "tower", "shelf" and "box" in one data column
  box_sample_separated: Boolean = true; // box position is separated from sample position in my excel
  prefix = '';
  appendix = '';
  join = '-';
  tower = 1;
  shelf = 1;
  box = 1;

  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService, ) {
  }
  ngOnInit() {
    this.bLabel = new BoxLabel();
    this.updateBoxLabel();
  }
  // step 1
  toggleBoxPositionDefinition() {
    this.box_defined_as_normal = !this.box_defined_as_normal;
  }
  toggleBoxTSBColumn() {
    this.box_tsb_one_column = !this.box_tsb_one_column;
  }
  toggleBoxSampleSeparated() {
    this.box_sample_separated = !this.box_sample_separated;
  }
  updatePrefix(evt: any) {
    this.prefix = evt;
  }
  updateTower(evt: any) {
    this.tower = evt;
  }
  updateShelf(evt: any) {
    this.shelf = evt;
  }
  updateBox(evt: any) {
    this.box = evt;
  }
  updateJoin(evt: any) {
    this.join = evt;
  }
  updateAppendix(evt: any) {
    this.appendix = evt;
  }
  saveFirstStep() {
    this.activeStep.emit(2);
    this.updateBoxLabel();
    this.boxLabel.emit(this.bLabel);
  }
  updateBoxLabel() {
    this.bLabel.appendix = this.appendix;
    this.bLabel.prefix = this.prefix;
    this.bLabel.join = this.join;
    this.bLabel.tower = this.tower;
    this.bLabel.shelf = this.shelf;
    this.bLabel.box = this.box;
    this.bLabel.box_defined_as_normal = this.box_defined_as_normal ;
    this.bLabel.box_tsb_one_column = this.box_tsb_one_column;
    this.bLabel.box_sample_separated = this.box_sample_separated;
  }
}
