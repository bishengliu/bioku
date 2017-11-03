import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { XlsxHelperService } from '../../_services/XlsxHelperService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { UtilityService } from '../../_services/UtilityService';
import { BoxLabel, SampleLabel } from '../../_classes/sampleUpload';
@Component({
  selector: 'app-container-sample-upload-helper',
  templateUrl: './container-sample-upload-helper.component.html',
  styleUrls: ['./container-sample-upload-helper.component.css']
})
export class ContainerSampleUploadHelperComponent implements OnInit {
  activeStep = 1;
  bLabel: BoxLabel = new BoxLabel();
  sLabel: SampleLabel = new SampleLabel();
  trigerChange = 0;
  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService,
              private xlsxHelperService: XlsxHelperService, ) {}

  // seprated
  captureActiveStep (evt: number) {
    this.activeStep = evt;
    this.trigerChange++;
  }
  captureBoxLabel(boxLabel: BoxLabel) {
    this.bLabel = boxLabel;
  }

  captureSampleLabel(sampleLabel: SampleLabel) {
    this.sLabel = sampleLabel;
  }

  ngOnInit() {
    // BoxLabel default
    this.bLabel.appendix = '';
    this.bLabel.prefix = '';
    this.bLabel.join = '-';
    this.bLabel.tower = 1;
    this.bLabel.shelf = 1;
    this.bLabel.box = 1;
    this.bLabel.box_defined_as_normal = true;
    this.bLabel.box_tsb_one_column = true;
    this.bLabel.box_sample_separated = true;

    // sample Label default
    this.sLabel.sampleLabelDefinition = 0;
    this.sLabel.boxLabel = 0;
    this.sLabel.boxJoin = '';
    this.sLabel.sampleRow = 0;
    this.sLabel.sampleColumn = 1;
    this.sLabel.sampleJoin = '';
    this.sLabel.box_horizontal = this.appSetting.BOX_HORIZONTAL;
    this.sLabel.box_vertical = this.appSetting.BOX_POSITION_LETTERS[this.appSetting.BOX_VERTICAL - 1]; // a letter
  }
}
