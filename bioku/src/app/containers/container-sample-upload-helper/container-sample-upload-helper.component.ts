import { Component, OnInit, Inject, ViewChild, Input, OnChanges } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { XlsxHelperService } from '../../_services/XlsxHelperService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { UtilityService } from '../../_services/UtilityService';
import { BoxLabel, SampleLabel, ColumnAttr, SampleDateFormat} from '../../_classes/sampleUpload';
@Component({
  selector: 'app-container-sample-upload-helper',
  templateUrl: './container-sample-upload-helper.component.html',
  styleUrls: ['./container-sample-upload-helper.component.css']
})
export class ContainerSampleUploadHelperComponent implements OnInit, OnChanges {
  @Input() uploadMode: number;
  activeStep = 1;
  bLabel: BoxLabel = new BoxLabel();
  sLabel: SampleLabel = new SampleLabel();
  trigerChange = 0;
  // data passed from step 3
  excelData: Array<Array<any>>;
  excelColAttrs: Array<ColumnAttr>;
  freezingDateFormat: SampleDateFormat;
  // validate and save
  start_validation_save: Boolean = false;
  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService,
              private xlsxHelperService: XlsxHelperService, ) {}

  // seprated
  captureActiveStep (evt: number) {
    this.activeStep = evt;
    this.trigerChange++;
  }
  captureBoxLabel(boxLabel: BoxLabel) {
    this.bLabel = boxLabel;
    if (this.bLabel.box_defined_as_normal === false && this.bLabel.box_sample_separated === false) {
      this.sLabel.sampleLabelDefinition = 0;
    }
  }

  captureSampleLabel(sampleLabel: SampleLabel) {
    this.sLabel = sampleLabel;
  }

  captureExcelData(data: Array<Array<any>>) {
    this.excelData = data;
    this.start_validation_save = true;
  }
  captureExcelCOlAttrs(excelColAttrs: Array<ColumnAttr>) {
    this.excelColAttrs = excelColAttrs;
  }
  captureFreezingDateFormat (freezing_date_format: SampleDateFormat) {
    this.freezingDateFormat = freezing_date_format;
  }
  ngOnInit() {
    // BoxLabel default
    this.bLabel.box_has_label = true;
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
  ngOnChanges() {
    if (this.uploadMode === 1) {
      this.activeStep = 3;
    }
  }
}
