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
  rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
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
    let bstr = e.target.result;
    if (!this.rABS) { bstr = new Uint8Array(bstr) };
    const workbook = XLSX.read(bstr, {type: this.rABS ? 'binary' : 'array'});
    /* grab first sheet */
    const wsname: string = workbook.SheetNames[0];
    const ws: XLSX.WorkSheet = workbook.Sheets[wsname];

    /* save data */
    this.data = <Array<Array<any>>>(XLSX.utils.sheet_to_json(ws, {header: 1}));
    console.log(this.data);
    };
    // reader.readAsBinaryString(target.files[0]);
    if (this.rABS) {reader.readAsBinaryString(target.files[0]); } else {reader.readAsArrayBuffer(target.files[0])};
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

  // DROP
   handleDrop(evt: any) {
    evt.stopPropagation(); evt.preventDefault();
    const files = evt.dataTransfer.files, f = files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      let bstr = e.target.result;
      if (!this.rABS) { bstr = new Uint8Array(bstr) };
      const workbook = XLSX.read(bstr, {type: this.rABS ? 'binary' : 'array'});

      /* grab first sheet */
    const wsname: string = workbook.SheetNames[0];
    const ws: XLSX.WorkSheet = workbook.Sheets[wsname];

    /* save data */
    this.data = <Array<Array<any>>>(XLSX.utils.sheet_to_json(ws, {header: 1}));
    console.log(this.data);

    };
    if (this.rABS) {reader.readAsBinaryString(f); } else {reader.readAsArrayBuffer(f)};
  }

  s2ab(s: string): ArrayBuffer {
    const buf: ArrayBuffer = new ArrayBuffer(s.length);
    const view: Uint8Array = new Uint8Array(buf);
    // tslint:disable-next-line:no-bitwise
    for (let i = 0; i !== s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF };
    return buf;
  }

  // get vale of a cell
  getCellValue(workbook: XLSX.WorkSheet, worksheet_name: string,  address_of_cell = 'A1'): any {
    /* Get worksheet */
    const worksheet = workbook.Sheets[worksheet_name];
    /* Find desired cell */
    const desired_cell = worksheet[address_of_cell];
    /* Get the value */
    const desired_value = (desired_cell ? desired_cell.v : undefined);
    return desired_value;
  }

  // append new sheet to a workbook
  newWorkSheet(workbook: XLSX.WorkSheet, worksheet_name, worksheet_data: Array<Array<any>>): void {
    /* make worksheet */
    const worksheet = XLSX.utils.aoa_to_sheet(worksheet_data);
    /* Add the sheet name to the list */
    workbook.SheetNames.push(worksheet_name);
    /* Load the worksheet object */
    workbook.Sheets[worksheet_name] = worksheet;
  }
}
