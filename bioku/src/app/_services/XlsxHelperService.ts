import { Injectable , Inject} from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { AlertService } from '../_services/AlertService';
@Injectable()
export class XlsxHelperService {
    workbook_opts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };
    constructor(private alertService: AlertService) { }

    // upload to json
    parseUpload(evt: any, rABS: Boolean): Observable<Array<Array<any>>> {
        const subject$ = new Subject<Array<Array<any>>>();
        try {
            // * wire up file reader */
            const target: DataTransfer = <DataTransfer>(evt.target);
            if (target.files.length !== 1) {
                this.alertService.error('Cannot upload multiple files!', false);
                subject$.error('Cannot upload multiple files!');
            };
            const reader: FileReader = new FileReader();
            let data: Array<Array<any>> = [];
            reader.onload = (e: any) => {
                /* read workbook */
                let bstr = e.target.result;
                if (!rABS) { bstr = new Uint8Array(bstr) };
                const workbook = XLSX.read(bstr, {type: rABS ? 'binary' : 'array'});
                /* grab first sheet */
                const worksheet_name: string = workbook.SheetNames[0];
                const worksheet: XLSX.WorkSheet = workbook.Sheets[worksheet_name];
                /* save data */
                data = <Array<Array<any>>>(XLSX.utils.sheet_to_json(worksheet, {header: 1}));
                subject$.next(data);
                subject$.complete();
            };
            if (rABS) {
                reader.readAsBinaryString(target.files[0]);
            } else {
                reader.readAsArrayBuffer(target.files[0]); };
        } catch (error) {
            subject$.error('Something went wrong!');
        }
        return subject$;
    }
    // for download to excel
    exportXlsx(data: Array<Array<any>>, worksheet_name: string, fileName: string) {
        /* generate worksheet */
        const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
        /* generate workbook and add the worksheet */
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, worksheet_name);
        /* save to file */
        const wbout: string = XLSX.write(workbook, this.workbook_opts);
        saveAs(new Blob([this.string2ArrayBuffer(wbout)]), fileName);
    }

    string2ArrayBuffer(s: string): ArrayBuffer {
        const buf: ArrayBuffer = new ArrayBuffer(s.length);
        const view: Uint8Array = new Uint8Array(buf);
        // tslint:disable-next-line:no-bitwise
        for (let i = 0; i !== s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF };
        return buf;
    }

    // only parse the first file
    parseDrop(evt: Array<File>, rABS: Boolean, fileName: string): Observable<Array<Array<any>>> {
        const subject$ = new Subject<Array<Array<any>>>();
        try {
            const files = evt, file = files[0];
            const reader = new FileReader();
            let data: Array<Array<any>> = [];
            reader.onload = (e: any) => {
                let bstr = e.target.result;
                if (!rABS) { bstr = new Uint8Array(bstr) };
                const workbook = XLSX.read(bstr, {type: rABS ? 'binary' : 'array'});
                /* grab first sheet */
                const worksheet_name: string = workbook.SheetNames[0];
                const worksheet: XLSX.WorkSheet = workbook.Sheets[worksheet_name];
                /* save data */
                data = <Array<Array<any>>>(XLSX.utils.sheet_to_json(worksheet, {header: 1}));
                subject$.next(data);
                subject$.complete();
            };
            if (rABS) { reader.readAsBinaryString(file); } else { reader.readAsArrayBuffer(file) };
        } catch (error) {
            subject$.error('Something went wrong!');
        }
        return subject$
    }

    // get vale of a cell
    getCellValue(workbook: XLSX.WorkSheet, worksheet_name: string,  address_of_cell: string): any {
        // address_of_cell='A1';
        /* Get worksheet */
        const worksheet = workbook.Sheets[worksheet_name];
        /* Find desired cell */
        const desired_cell = worksheet[address_of_cell];
        /* Get the value */
        const desired_value = (desired_cell ? desired_cell.v : undefined);
        return desired_value;
    }

    // add new sheet to a workbook
    newWorkSheet(workbook: XLSX.WorkSheet, worksheet_name, worksheet_data: Array<Array<any>>): void {
        /* make worksheet */
        const worksheet = XLSX.utils.aoa_to_sheet(worksheet_data);
        /* Add the sheet name to the list */
        workbook.SheetNames.push(worksheet_name);
        /* Load the worksheet object */
        workbook.Sheets[worksheet_name] = worksheet;
    }
}
