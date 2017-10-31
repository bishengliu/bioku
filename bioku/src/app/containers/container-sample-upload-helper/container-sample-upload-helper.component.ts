import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { XlsxHelperService } from '../../_services/XlsxHelperService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { UtilityService } from '../../_services/UtilityService';

@Component({
  selector: 'app-container-sample-upload-helper',
  templateUrl: './container-sample-upload-helper.component.html',
  styleUrls: ['./container-sample-upload-helper.component.css']
})
export class ContainerSampleUploadHelperComponent implements OnInit {
  // step 1
  box_defined_as_normal: Boolean = true;
  box_tsb_one_column: Boolean = true; // "tower", "shelf" and "box" in one data column
  box_sample_separated: Boolean = true; // box position is separated from sample position in my excel
  activeStep = 1;
  prefix = '';
  appendix = '';
  join = '-';
  tower = 1;
  shelf = 1;
  box = 1;
  // end step 1
  // step 2
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
  // end step 2
  // step 3
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
  sample_type = 'GENERAL';
  max_column_count = 10;
  column_count = 10;
  excel_file_has_header: Boolean = true;
  // end step 3
  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService,
              private xlsxHelperService: XlsxHelperService, ) {
    // SET THE DEFAULT BOX LAYOUT
    this.box_horizontal = this.appSetting.BOX_HORIZONTAL;
    this.box_vertical = this.appSetting.BOX_POSITION_LETTERS[this.appSetting.BOX_VERTICAL - 1]; // a letter
    this.hArray = this.utilityService.genArray(this.box_horizontal);
    this.vArray = this.appSetting.BOX_POSITION_LETTERS.slice(0, this.appSetting.BOX_POSITION_LETTERS.indexOf(this.box_vertical) + 1 );
  }

  ngOnInit() {
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
    this.activeStep = this.activeStep + 1;
  }
  // end step 1

  // step 2
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
    this.activeStep = this.activeStep - 1;
  }
  saveSecondStep() {
    this.activeStep = this.activeStep + 1;
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
  // end step 2
  // step 3
  // DROP oly one excel xlsx file
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
    this.activeStep = this.activeStep - 1;
    this.data = [];
    this.uploaded = false;
    this.data_to_display = 100;
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
  // end step 3
}
