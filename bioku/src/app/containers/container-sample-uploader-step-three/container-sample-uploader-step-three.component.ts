import { Component, OnInit, Inject, EventEmitter, Output, Input } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { XlsxHelperService } from '../../_services/XlsxHelperService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { UtilityService } from '../../_services/UtilityService';
import { BoxLabel, SampleLabel, SampleAttr, SampleFile } from '../../_classes/sampleUpload';

@Component({
  selector: 'app-container-sample-uploader-step-three',
  templateUrl: './container-sample-uploader-step-three.component.html',
  styleUrls: ['./container-sample-uploader-step-three.component.css']
})
export class ContainerSampleUploaderStepThreeComponent implements OnInit {
  @Output() activeStep: EventEmitter<number> = new EventEmitter<number> ();
  @Input() sLabel: SampleLabel;
  @Input() bLabel: BoxLabel;
  uploaded: Boolean = false;
  data: Array<Array<any>> = [];
  workbook_opts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };
  fileName = 'SheetJS.xlsx';
  worksheet_name = 'sheet';
  allowedFileExtension: Array<string> = ['xlsx'];
  allowedMultipleFiles: Boolean = false;
  rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
  data_to_display = 100;
  parsing_file: Boolean = false;

  sampleFile: SampleFile = new SampleFile();
  sample_type = 'GENERAL';
  max_column_count = 10;
  column_count = 10;
  excel_file_has_header: Boolean = true;

  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService,
              private xlsxHelperService: XlsxHelperService, ) { }

  ngOnInit() {
    this.sampleFile = new SampleFile();
    this.setDefaultSampleFile();
  }
  handleValidFileDrop(evt: Array<File>) {
    this.parsing_file = true;
    this.xlsxHelperService.parseDrop(evt, this.rABS, this.fileName)
    .subscribe(
      (data: Array<Array<any>>) => {
        this.data = this.trimData(data);
        this.uploaded = true;
        this.data_to_display = this.data.length > 100 ? 100 : this.data.length;
        this.parsing_file = false;
        console.log(this.data);
      },
      (err: string) => {
        console.log(err);
        this.uploaded = false;
        this.parsing_file = false;
      });
  }
  trimData (data: Array<Array<any>>): Array<Array<any>> {
    return data.filter((d: Array<any>) => {
      return d.length > 0;
    })
  }
  backSecondStep() {
    this.activeStep.emit(2);
    this.data = [];
    this.uploaded = false;
    this.data_to_display = 100;
    this.setDefaultSampleFile()
  }
  updateSampleType(sample_type: string): void {
    this.sample_type = sample_type === '' ? this.sample_type : sample_type;
    ////////////need to get column count and data attrs ////////////

  }
  toggleExcelFilerHeader() {
    this.excel_file_has_header = !this.excel_file_has_header;
  }
  updateColumnCount (evt: any) {
    this.column_count = evt;
  }
  setDefaultSampleFile() {
    this.sample_type = 'GENERAL';
    this.max_column_count = 10;
    this.column_count = 10;
    this.excel_file_has_header = true;

    // set up column count and headers
  }
}
