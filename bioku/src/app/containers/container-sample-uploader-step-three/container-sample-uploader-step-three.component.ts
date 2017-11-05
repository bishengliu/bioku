import { Component, OnInit, Inject, EventEmitter, Output, Input, OnDestroy, OnChanges } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { XlsxHelperService } from '../../_services/XlsxHelperService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { UtilityService } from '../../_services/UtilityService';
import { BoxLabel, SampleLabel, ColumnAttr, SampleFile, SampleExcelHeaders, SampleDateFormat } from '../../_classes/sampleUpload';
// dragula
import { DragulaService } from 'ng2-dragula/ng2-dragula';

@Component({
  selector: 'app-container-sample-uploader-step-three',
  templateUrl: './container-sample-uploader-step-three.component.html',
  styleUrls: ['./container-sample-uploader-step-three.component.css']
})
export class ContainerSampleUploaderStepThreeComponent implements OnInit, OnDestroy, OnChanges {
  @Output() activeStep: EventEmitter<number> = new EventEmitter<number> ();
  @Input() sLabel: SampleLabel;
  @Input() bLabel: BoxLabel;
  @Input() uploadMode: number;
  @Input() trigerChange;
  uploaded: Boolean = false;
  data: Array<Array<any>> = [];
  original_file_headers_uploaded: Array<any> = [];
  workbook_opts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };
  fileName = 'SheetJS.xlsx';
  worksheet_name = 'sheet';
  allowedFileExtension: Array<string> = ['xlsx'];
  allowedMultipleFiles: Boolean = false;
  rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
  data_to_display = 100;
  parsing_file: Boolean = false;

  sampleFile: SampleFile = new SampleFile();
  column_headers: Array<string> = [];
  sample_type = 'GENERAL';
  excel_file_has_header: Boolean = true;

  // excel upload map to sample model
  excelColAttrs: Array<ColumnAttr> = [];
  // get the requied columns
   all_requied_headers: Array<string> = [];

   // dragular driective options
   private dragulaDrop$: any;
   dragulaOptions: any = {
      direction: 'vertical',
      revertOnSpill: true,
      accepts: (el, container, handle) => { return el.id !== 'no-drop'; },
      // accepts: (el, container, handle) => { return container.id !== 'no-drop'; }, // prevent from drop back
      // copy: (el, container, handle) => { return container.id === 'no-drop'; }, // copy for this container only
      // removeOnSpill: (el, container, handle) => { return container.id !== 'no-drop'; }, // for not this container
   };
  // check for requied column
  column_header_is_set: Boolean = false;
  // start to upload excel
  all_set_start_to_upload_file: Boolean = false;

  // no data after upload
  // parse excel file failed
  excel_parse_failed: Boolean = false;
  no_valid_sample: Boolean = false;
  // sample date
  short_months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
                                'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  long_months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                                'August', 'September', 'October', 'November', 'December'];
  FREEZING_DATE = 'Freezing Date';
  freezing_date_sample_attr_index: number;
  freezing_date_included: Boolean = false;
  freezing_date_format_is_set: Boolean = false;
  freezing_date_format: SampleDateFormat = new SampleDateFormat();
  // all dates need to format to '2017-05-01',
  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService,
              private xlsxHelperService: XlsxHelperService, private dragulaService: DragulaService) { }

  ngOnInit() {
    this.sampleFile = new SampleFile();
    this.setDefaultSampleFile();
    this.all_requied_headers = this.getRequiredColumnHeader();
    // dragular column headers
    this.dragulaDrop$ = this.dragulaService.drop.subscribe((value) => {
      console.log(value);
      if (value[0] === 'bag') {
        // col header bag
        const header_div_moved = value[1]; // el moved
        const source = value[3];
        const target = value[2];
        // prevent from put 2 heders in td
        if (target.id !== 'column_headers' &&  target.children.length > 1 ) {
          this.dragulaService.find('bag').drake.cancel(true);
        } else {
          const source_column = source.attributes['column'].value;
          const target_column = target.attributes['column'].value
          const header_moved = header_div_moved.attributes['header'].value
          this.onDragulaDrop(+source_column, +target_column, header_moved);
        }
      } else {
        console.log('date ...');
        
      }
    });
  }
  private onDragulaDrop(source_column: number, target_column: number, header_moved: string) {
    // console.log([source_column, target_column, header_moved]);
    this.updateColumnAttrs(source_column, target_column, header_moved);
    // check whether the freezing date is drag into the table or drag out of the table
    if (header_moved === this.FREEZING_DATE) {
      if ( target_column !== -1 ) {
        // draged into the table
        this.freezing_date_included = true;
        this.freezing_date_format_is_set = false;
      } else {
        // draged out of the table
        this.freezing_date_included = false;
        this.freezing_date_format_is_set = false;
      }
    }
    // this.freezing_date_sample_attr_index
  }

  handleValidFileDrop(evt: Array<File>) {
    this.parsing_file = true;
    this.uploaded = false;
    this.no_valid_sample = false;
    this.excel_parse_failed = false;
    this.xlsxHelperService.parseDrop(evt, this.rABS, this.fileName)
    .subscribe(
      (data: Array<Array<any>>) => {
        this.data = this.trimData(data);
        if (this.data.length > 0) {
          if (this.excel_file_has_header) {
            const header_data = this.data.splice(0, 1);
            this.original_file_headers_uploaded = [...header_data[0]];
          } else {
            this.original_file_headers_uploaded = [...this.data[0]];
          }
        }
        if (this.data.length === 0) {
          this.no_valid_sample = true;
        }
        this.uploaded = true;
        this.data_to_display = this.data.length > 100 ? 100 : this.data.length;
        this.parsing_file = false;
        console.log(this.data);
      },
      (err: string) => {
        console.log(err);
        this.excel_parse_failed = true;
        this.uploaded = false;
        this.parsing_file = false;
      });
  }

  renderExcelHeader(hdr: string, hindex: number) {
    const html_hder = this.excel_file_has_header ? '<span class="grey-text">' + hdr + '</span>' : '';
    let excel_header = '';
    const col = hindex + 1;
    const matched_headers = this.excelColAttrs.filter(a => a.col_number === col);
    excel_header = matched_headers.length > 0 ? ('<span class="red-text">' + matched_headers[0].col_header + '</span>') : html_hder;
    return excel_header;
  }

  // only trim the top not the left side
  trimData (data: Array<Array<any>>): Array<Array<any>> {
    return data.filter((d: Array<any>) => {
      return d.length > 0;
    })
  }
  // need to parse the freezing date //////////////////s

  backSecondStep() {
    this.activeStep.emit(2);
    this.data = [];
    this.uploaded = false;
    this.data_to_display = 100;
    this.setDefaultSampleFile()
  }

  updateSampleType(sample_type: string): void {
    this.sample_type = sample_type === '' ? this.sample_type : sample_type;
    // get the column headers for current sample type
    this.column_headers = this.updateColumnHeaders(this.sample_type, this.bLabel, this.sLabel);
    // prepare the default column attrs
    this.setDefaultColumnAttrs();
  }

  toggleExcelFilerHeader() {
    this.excel_file_has_header = !this.excel_file_has_header;
  }

  setDefaultSampleFile() {
    this.sample_type = 'GENERAL';
    this.excel_file_has_header = true;
    this.column_header_is_set = false;
    this.all_set_start_to_upload_file = false;
    this.excel_parse_failed = false;
    this.no_valid_sample = false;
    this.parsing_file = false
    this.freezing_date_included = false;
    this.freezing_date_format_is_set = false;
    // set up column count and headers
    this.column_headers = this.updateColumnHeaders(this.sample_type, this.bLabel, this.sLabel);
    this.setDefaultColumnAttrs();
  }

  updateColumnHeaders (sample_type: string, bLabel: BoxLabel, sLabel: SampleLabel): Array<string> {
    const all_headers: Array<SampleExcelHeaders> = this.getAllExcelHeaders();
    let sample_headers: Array<string> = [];
    // box label
    const box_label_headers = all_headers.filter(h => h.header_type === 'box_position')[0].headers;
    if (bLabel.box_defined_as_normal && bLabel.box_tsb_one_column) {
      sample_headers.push(box_label_headers[0]);
      // 1 col for box label
    } else if (bLabel.box_defined_as_normal && !bLabel.box_tsb_one_column) {
      sample_headers.push(box_label_headers[1]);
      sample_headers.push(box_label_headers[2]);
      sample_headers.push(box_label_headers[3]);
      // 3 col for box label
    } else if (!bLabel.box_defined_as_normal && bLabel.box_sample_separated) {
      // 1 col for box label
      sample_headers.push(box_label_headers[0]);
    } else {
      // no box lable col
    }
    // sample label
    const sample_label_headers = all_headers.filter(h => h.header_type === 'sample_position')[0].headers;
    if (sLabel.sampleLabelDefinition === 1) {
      // 2 cols for sample label
      sample_headers.push(sample_label_headers[1]);
      sample_headers.push(sample_label_headers[2]);

    } else {
      // 1 col for sample label
      sample_headers.push(sample_label_headers[0]);
    }
    const general_headers: Array<string> = all_headers.filter(h => h.header_type === 'general_headers')[0].headers;
    const cell_headers: Array<string> = all_headers.filter(h => h.header_type === 'cell_headers')[0].headers;
    const construct_headers: Array<string> = all_headers.filter(h => h.header_type === 'construct_headers')[0].headers;
    const oligo_headers: Array<string> = all_headers.filter(h => h.header_type === 'oligo_headers')[0].headers;
    const tissue_headers: Array<string> = all_headers.filter(h => h.header_type === 'tissue_headers')[0].headers;
    const virus_headers: Array<string> = all_headers.filter(h => h.header_type === 'virus_headers')[0].headers;
    switch (sample_type) {
      case 'GENERAL':
        sample_headers = [...sample_headers, ...general_headers];
        break;
      case 'CELL':
        sample_headers = [...sample_headers, ...general_headers, ...cell_headers];
        break;
      case 'CONSTRUCT':
        sample_headers = [...sample_headers, ...general_headers, ...construct_headers];
        break;
      case 'OLIGO':
        sample_headers = [...sample_headers, ...general_headers, ...oligo_headers];
        break;
      case 'gRNA_OLIGO':
        sample_headers = [...sample_headers, ...general_headers, ...oligo_headers];
        break;
      case 'TISSUE':
        sample_headers = [...sample_headers, ...general_headers, ...tissue_headers];
        break;
      case 'VIRUS':
        sample_headers = [...sample_headers, ...general_headers, ...virus_headers];
        break;
      default:
        sample_headers = [...sample_headers, ...general_headers];
        break;
    }
    return sample_headers;
  }

  setDefaultColumnAttrs (): void {
    this.excelColAttrs = [];
    const allColumnHeaders = this.getAllColumnHeaders();
    this.column_headers.forEach((h: string) => {
      const colAttr = new ColumnAttr();
      // get the index of current header
      const col_index = allColumnHeaders.indexOf(h);
      if (col_index !== -1) {
        const columnAttr = new ColumnAttr();
        columnAttr.col_header = h;
        columnAttr.col_number = -1;
        columnAttr.sample_attr_index = col_index; // use this to map to sample table attr
        this.excelColAttrs.push(columnAttr);
      }
    });
    // find the freezing date sample_attr_index
    this.freezing_date_sample_attr_index = this.getFreezingDateSampleModelIndex();
    // preapre the freezing date format
    this.setDefaultFreezingDateFormat();
  }

  updateColumnAttrs (source_column: number, target_column: number, header_moved: string): void {
    // move
    this.excelColAttrs.forEach(a => {
      if (a.col_header === header_moved) {
        a.col_number = target_column;
      }
    });
    this.validRequiredColumns(); // update required colmns
  }

  validRequiredColumns() {
    let is_valid = true;
    const all_requied_headers = this.all_requied_headers;
    this.excelColAttrs.forEach( (c: ColumnAttr) => {
      if ( all_requied_headers.indexOf(c.col_header) !== -1 && c.col_number === -1) {
        is_valid = false;
      }
    });
    this.column_header_is_set = is_valid ? true : false;
  }

  // if freezing_date is drage, ask the user to provide the date format
  getFreezingDateSampleModelIndex(): number {
    const allColumnHeaders = this.getAllColumnHeaders();
    return allColumnHeaders.indexOf(this.FREEZING_DATE);
  }
  // set up the default freezing_date_format
  setDefaultFreezingDateFormat(): void {
    this.freezing_date_format.day_position = 3;
    this.freezing_date_format.month_position = 2;
    this.freezing_date_format.year_position = 1;
    this.freezing_date_format.join_symbol = '-';
    this.freezing_date_format.month_format = 0; // nummeric
    this.freezing_date_format.year_format = 0; // yyyy
  }
  // set freezing_date_format upon draged into the table
  updateFreezingDateFormat(type: string, value: any): void {
    this.freezing_date_format[type] = value;
    console.log(this.freezing_date_format);
  }
  // display formated date
  displayFreezingDate() {
    const fArray: Array<string> = [];
    fArray[this.freezing_date_format.day_position - 1] = '25';
    // month
    let month_example = '12';
    if (+this.freezing_date_format.month_format === 1) {
    // full month
      month_example = 'December';
    } else if (+this.freezing_date_format.month_format === 2) {
      month_example = 'Dec';
    } else {
      month_example = '12';
    }
    fArray[+this.freezing_date_format.month_position - 1] = month_example;
    // year
    fArray[+this.freezing_date_format.year_position - 1] = this.freezing_date_format.year_format === 0 ? '2017' : '17';
    return fArray.join(this.freezing_date_format.join_symbol);
  }
  doneFreezingDateFormat() {
    this.freezing_date_format_is_set = true;
  }
  doneColumnHeaders() {
    this.all_set_start_to_upload_file = true;
  }
  ///////////// DONOT CHANGE THIS: the order of each item must not be changed /////////////////
  getAllExcelHeaders(): Array<SampleExcelHeaders> {
    const all_headers: Array<SampleExcelHeaders>  = [];
    const box_position_headers = new SampleExcelHeaders();
    box_position_headers.headers =  ['BoxLabel', 'BoxLabel_Tower', 'BoxLabel_Shelf', 'BoxLabel_Box'];
    box_position_headers.header_type = 'box_position';
    all_headers.push(box_position_headers);

    const sample_position_headers = new SampleExcelHeaders();
    sample_position_headers.headers =  ['SampleLabel', 'SampleLabel_Row', 'SampleLabel_Column'];
    sample_position_headers.header_type = 'sample_position';
    all_headers.push(sample_position_headers);

    const general_headers = new SampleExcelHeaders();
    general_headers.headers =  ['Name', 'Tag', 'Offical Name', 'Sample Code', 'External Reference', 'Quantity',
    'Quantity Unit', 'Freezing Code', this.FREEZING_DATE, 'Description'];
    general_headers.header_type = 'general_headers';
    all_headers.push(general_headers);

    const cell_headers = new SampleExcelHeaders();
    cell_headers.headers =  ['Passage Number', 'Cell Cmount', 'Project', 'Creator'];
    cell_headers.header_type = 'cell_headers';
    all_headers.push(cell_headers);

    const construct_headers = new SampleExcelHeaders();
    construct_headers.headers =  ['Clone Number', '260/280', 'Feature', 'R.E. Analysis', 'Backbone', 'Insert',
    '1st maxi', 'Marker', 'Has Glycerol Stock', 'Stock Strain'];
    construct_headers.header_type = 'construct_headers';
    all_headers.push(construct_headers);

    const oligo_headers = new SampleExcelHeaders();
    oligo_headers.headers =  ['Oligo Name', 'Sense/Antisense', 'Oligo Sequence', 'Oligo Length', 'GC%', 'Target Sequence'];
    oligo_headers.header_type = 'oligo_headers';
    all_headers.push(oligo_headers);

    const tissue_headers = new SampleExcelHeaders();
    tissue_headers.headers =  ['Pathology Code', 'Tissue'];
    tissue_headers.header_type = 'tissue_headers';
    all_headers.push(tissue_headers);

    const virus_headers = new SampleExcelHeaders();
    virus_headers.headers =  ['Plasmid', 'Titration Titer', 'Titration Unit', 'Titration Cell Type', 'Titration Code'];
    virus_headers.header_type = 'virus_headers';
    all_headers.push(virus_headers);

    return all_headers;
  }
  ///////////// DONOT CHANGE THIS: the order of each item must not be changed/////////////////
  getAllColumnHeaders(): Array<string> {
    let all_headers: Array<string>  = [];
    const sampleExcelHeaders: Array<SampleExcelHeaders> = this.getAllExcelHeaders();
    const box_label_headers = sampleExcelHeaders.filter(h => h.header_type === 'box_position')[0].headers;
    const sample_label_headers = sampleExcelHeaders.filter(h => h.header_type === 'sample_position')[0].headers;
    const general_headers: Array<string> = sampleExcelHeaders.filter(h => h.header_type === 'general_headers')[0].headers;
    const cell_headers: Array<string> = sampleExcelHeaders.filter(h => h.header_type === 'cell_headers')[0].headers;
    const construct_headers: Array<string> = sampleExcelHeaders.filter(h => h.header_type === 'construct_headers')[0].headers;
    const oligo_headers: Array<string> = sampleExcelHeaders.filter(h => h.header_type === 'oligo_headers')[0].headers;
    const tissue_headers: Array<string> = sampleExcelHeaders.filter(h => h.header_type === 'tissue_headers')[0].headers;
    const virus_headers: Array<string> = sampleExcelHeaders.filter(h => h.header_type === 'virus_headers')[0].headers;
    all_headers = [
      ...box_label_headers, ...sample_label_headers, ...general_headers,
      ...cell_headers, ...construct_headers, ...oligo_headers, ...tissue_headers, ...virus_headers
    ];
    return all_headers;
  }
  ///////////// DONOT CHANGE THIS: the order of each item must not be changed/////////////////
  getAllColumnAttrs(): Array<string> {
    let all_headers: Array<string>  = [];
    const box_position_headers =  ['box_position', 'box_position_tower', 'box_position_shelf', 'box_position_box'];
    const sample_position_headers =  ['sample_position', 'sample_position_row', 'sample_position_column'];
    const general_headers =  ['name', 'tag', 'official_name', 'registration_code', 'reference_code', 'quantity',
    'quantity_unit', 'freezing_code', 'freezing_date', 'description'];
    const cell_headers =  ['passage_number', 'cell_amount', 'project', 'creator'];
    const construct_headers =  ['clone_number', 'against_260_280', 'feature', 'r_e_analysis', 'backbone', 'insert',
    'first_max', 'marker', 'has_glycerol_stock', 'strain'];
    const oligo_headers =  ['oligo_name', 's_or_as', 'oligo_sequence', 'oligo_length', 'oligo_GC', 'target_sequence'];
    const tissue_headers =  ['pathology_code', 'tissue'];
    const virus_headers =  ['plasmid', 'titration_titer', 'titration_unit', 'titration_cell_type', 'titration_code'];
    all_headers = [...box_position_headers, ...sample_position_headers, ...general_headers,
      ...cell_headers, ...construct_headers, ...oligo_headers, ...tissue_headers, ...virus_headers];
    return all_headers;
  }
  ///////////// DONOT CHANGE THIS /////////////////
  getRequiredColumnHeader() {
    const sampleExcelHeaders: Array<SampleExcelHeaders> = this.getAllExcelHeaders();
    const box_label_headers = sampleExcelHeaders.filter(h => h.header_type === 'box_position')[0].headers;
    const sample_label_headers = sampleExcelHeaders.filter(h => h.header_type === 'sample_position')[0].headers;
    return [...box_label_headers, ...sample_label_headers, 'Name'];
  }
  ngOnDestroy() {
    if (this.dragulaDrop$ !== undefined) {
      this.dragulaDrop$.unsubscribe();
    }
  }
  parseLetter2Number(letter: string) {
    return this.appSetting.BOX_POSITION_LETTERS.indexOf(letter.toUpperCase()) + 1;
  }
  ngOnChanges() {
    this.column_headers = this.updateColumnHeaders(this.sample_type, this.bLabel, this.sLabel);
    this.setDefaultColumnAttrs();
  }
}
