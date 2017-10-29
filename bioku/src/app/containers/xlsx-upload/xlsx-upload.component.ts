import { Component, OnInit, Inject } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { XlsxHelperService } from '../../_services/XlsxHelperService';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';

@Component({
  selector: 'app-xlsx-upload',
  templateUrl: './xlsx-upload.component.html',
  styleUrls: ['./xlsx-upload.component.css']
})
export class XlsxUploadComponent implements OnInit {

  data: Array<Array<any>> = [];
  workbook_opts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };
  fileName = 'SheetJS.xlsx';
  worksheet_name = '';
  allowedFileExtension: Array<string> = ['xlsx'];
  allowedMultipleFiles: Boolean = false;
  rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
  constructor(private xlsxHelperService: XlsxHelperService, @Inject(APP_CONFIG) private appSetting: any, ) { }

  ngOnInit() { }

  onFileChange(evt: any) {
    this.xlsxHelperService.parseUpload(evt, this.rABS)
    .subscribe(
      (data: Array<Array<any>>) => {
        this.data = data; console.log(this.data); },
      (err: string) => {
        console.log(err);
      });
  }

  exportXlsx(): void {
    this.xlsxHelperService.exportXlsx(this.data, this.worksheet_name, this.fileName);
  }

  onFileDrop(evt: any) {
    console.log(evt);
  }

  // DROP
  handleValidFileDrop(evt: any) {
     console.log(evt);
    // this.xlsxHelperService.parseDrop(evt, this.rABS, this.fileName)
    // .subscribe(
    //   (data: Array<Array<any>>) => {
    //     this.data = data; console.log(this.data); },
    //   (err: string) => {
    //     console.log(err);
    //   });
  }
}
