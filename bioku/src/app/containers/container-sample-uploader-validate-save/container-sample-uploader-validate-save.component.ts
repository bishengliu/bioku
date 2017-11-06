import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BoxLabel, SampleLabel, ColumnAttr, SampleFile, SampleExcelHeaders, SampleDateFormat } from '../../_classes/sampleUpload';
@Component({
  selector: 'app-container-sample-uploader-validate-save',
  templateUrl: './container-sample-uploader-validate-save.component.html',
  styleUrls: ['./container-sample-uploader-validate-save.component.css']
})
export class ContainerSampleUploaderValidateSaveComponent implements OnInit, OnChanges {
  @Input() sLabel: SampleLabel;
  @Input() bLabel: BoxLabel;
  @Input() excelData: Array<Array<any>>;
  @Input() excelColAttrs: Array<ColumnAttr>;
  @Input() freezingDateFormat: SampleDateFormat;
  @Input() startValidation: Boolean;
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    if (this.startValidation) {
      // start validation
      console.log(this.bLabel);
      console.log(this.sLabel);
      console.log(this.freezingDateFormat);
      console.log(this.excelColAttrs);
      console.log(this.excelData);
    }
  }
}
