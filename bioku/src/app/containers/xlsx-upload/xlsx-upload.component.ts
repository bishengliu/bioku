import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// import { saveAs } from 'file-saver';
@Component({
  selector: 'app-xlsx-upload',
  templateUrl: './xlsx-upload.component.html',
  styleUrls: ['./xlsx-upload.component.css']
})
export class XlsxUploadComponent implements OnInit {

  data: Array<Array<any>> = [ [1, 2], [3, 4] ];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };
  fileName: String = 'SheetJS.xlsx';

  constructor() { }

  ngOnInit() {
  }

  onFileChange(evt: any) {
    // * wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) { throw new Error('Cannot use multiple files') };
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
    /* read workbook */
    const bstr: string = e.target.result;
    const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    this.data = <Array<Array<any>>>(XLSX.utils.sheet_to_json(ws, {header: 1}));
    console.log(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
}
  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    const wbout: string = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([this.s2ab(wbout)]), 'SheetJS.xlsx');
  }

  s2ab(s: string): ArrayBuffer {
    const buf: ArrayBuffer = new ArrayBuffer(s.length);
    const view: Uint8Array = new Uint8Array(buf);
    // tslint:disable-next-line:no-bitwise
    for (let i = 0; i !== s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF };
    return buf;
  }
}
