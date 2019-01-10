import { Component, OnInit, Inject, EventEmitter, Output, Input, OnDestroy, OnChanges } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { XlsxHelperService } from '../../_services/XlsxHelperService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { UtilityService } from '../../_services/UtilityService';
import { ExcelUploadLoadService } from '../../_services/ExcelUploadLoadService';
import { BoxLabel, SampleLabel, ColumnAttr, SampleFile, SampleExcelHeaders, SampleDateFormat, SampleUploadDateFormat } from '../../_classes/SampleUpload';
// dragula
import { DragulaService } from 'ng2-dragula/ng2-dragula';
// ctype
import { CType, CTypeAttr, CTypeSubAttr } from '../../_classes/CType';
import { CTypeService } from '../../_services/CTypeService';
import { AlertService } from '../../_services/AlertService';
@Component({
  selector: 'app-container-sample-uploader-step-three',
  templateUrl: './container-sample-uploader-step-three.component.html',
  styleUrls: ['./container-sample-uploader-step-three.component.css']
})
export class ContainerSampleUploaderStepThreeComponent implements OnInit, OnDestroy, OnChanges {
  @Output() activeStep: EventEmitter<number> = new EventEmitter<number> ();
  @Output() excelData: EventEmitter<Array<Array<any>>> = new EventEmitter<Array<Array<any>>> ();
  @Output() colAttrs: EventEmitter<Array<ColumnAttr>> = new EventEmitter<Array<ColumnAttr>> ();
  @Output() freezingDateFormat: EventEmitter<SampleDateFormat> = new EventEmitter<SampleDateFormat> ();
  @Output() excelHasFileHeader: EventEmitter<Boolean> = new EventEmitter<Boolean> ();
  @Output() sampleType: EventEmitter<string> = new EventEmitter<string> ();
  @Input() sLabel: SampleLabel;
  @Input() bLabel: BoxLabel;
  @Input() uploadMode: number;
  @Input() trigerChange;
  uploaded = false;
  data: Array<Array<any>> = [];
  excelRawData: Array<Array<any>> = [];
  original_file_headers_uploaded: Array<any> = [];
  workbook_opts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };
  fileName = 'SheetJS.xlsx';
  worksheet_name = 'sheet';
  allowedFileExtension: Array<string> = ['xlsx'];
  allowedMultipleFiles = false;
  rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
  data_to_display = 100;
  parsing_file = false;

  sampleFile: SampleFile = new SampleFile();
  column_headers: Array<string> = [];
  sample_type = ''; //GENERAL
  excel_file_has_header = true;
  sample_types: Array<string> = [];
  // excel upload map to sample model
  excelColAttrs: Array<ColumnAttr> = [];
  // get the requied columns
  all_requied_headers: Array<string> = [];
   // dragular driective options
   private dragulaDrop$: any;
   dragulaOptions: any = {
      direction: 'vertical',
      revertOnSpill: true,
      accepts: (el, target, source, sibling) => {
        if (target.id === 'date_position') {
          if (el.id === 'no-drop') {
            return false;
          } else {
            if (sibling == null) {
              return false;
            }
            return true;
          }
        } else {
          // allow drop for colmn headers
          return true;
        }
      },
      // accepts: (el, container, handle) => { return container.id !== 'no-drop'; }, // prevent from drop back
      // copy: (el, container, handle) => { return container.id === 'no-drop'; }, // copy for this container only
      // removeOnSpill: (el, container, handle) => { return container.id !== 'no-drop'; }, // for not this container
   };
  // check for requied column
  column_header_is_set = false;
  // start to upload excel
  all_set_start_to_upload_file = false;
  // no data after upload
  // parse excel file failed
  excel_parse_failed = false;
  no_valid_sample = false;
  // sample date
  short_months: Array<string> = [];
  long_months: Array<string> = [];
  FREEZING_DATE = 'Freezing Date';
  // freezing_date_sample_attr_index: number;
  // freezing_date_included = false;
  // freezing_date_format_is_set = false;
  // freezing_date_format: SampleDateFormat = new SampleDateFormat();
  // all date formats
  all_date_format_is_set = false;
  require_set_date_format = false;
  date_formats: Array<SampleUploadDateFormat> = new Array<SampleUploadDateFormat>();
  date_dropped: SampleUploadDateFormat = new SampleUploadDateFormat();
  // ctype
  ctypes: Array<CType> = new Array<CType>();
  USE_CSAMPLE = true;
  // all dates need to format to '2017-05-01',
  constructor(@Inject(APP_CONFIG) private appSetting: any, private utilityService: UtilityService,
              private excelUploadLoadService: ExcelUploadLoadService, private ctypeService: CTypeService,
              private xlsxHelperService: XlsxHelperService, private dragulaService: DragulaService,
              private alertService: AlertService) {
    this.short_months = this.utilityService.getShortMonthNames();
    this.long_months = this.utilityService.getLongMonthNames();
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
    if (this.USE_CSAMPLE) {
      // ctypes
      this.sample_types = this.ctypes.map((ctype: CType) => ctype.type);
    } else {
      this.sample_types = this.appSetting.SAMPLE_TYPE;
    }
  }

  ngOnInit() {
    this.sampleFile = new SampleFile();
    this.setDefaultSampleFile();
    this.all_requied_headers = this.getRequiredColumnHeader();
    if (this.USE_CSAMPLE){
      // get all the ctypes
      this.ctypeService.getCTypes()
      .subscribe(
        (ctypes: Array<CType>) => {
          this.ctypes = ctypes;
          // update ctypes
          this.sample_types = this.ctypes.map((ctype: CType) => ctype.type);
          if (this.USE_CSAMPLE && this.sample_types.length > 0){
            this.sample_type = this.sample_types[0];
            // update again
            this.setDefaultSampleFile();
          }
        },
        (err) => {
          this.alertService.error('fail to load material types, please try again later!', false);
          console.log(err)
        });
    }
    // dragular column headers
    this.dragulaDrop$ = this.dragulaService.drop.subscribe((value) => {
      const el = value[1]; // el moved
      const source = value[3];
      const target = value[2];
      if (value[0] === 'bag') {
        // col header bag
        // prevent from put 2 heders in td
        if (target.id !== 'column_headers' &&  target.children.length > 1 ) {
          this.dragulaService.find('bag').drake.cancel(true);
        } else {
          const source_column = source.attributes['column'].value;
          const target_column = target.attributes['column'].value
          const header_moved = el.attributes['header'].value
          this.onDragulaDrop(+source_column, +target_column, header_moved);
        }
      } else {
        const sibling = value[4];
        if (sibling != null) {
          this.onDragulaDateDrop(el.id, sibling.id);
          this.require_set_date_format = true;
        }
      }
    });
  }
  private onDragulaDrop(source_column: number, target_column: number, header_moved: string) {
    this.updateColumnAttrs(source_column, target_column, header_moved);
    // check whether the freezing date is drag into the table or drag out of the table
    const date_dropped = this.date_formats.find((df: SampleUploadDateFormat)=> { return df.date_attr_label === header_moved })
    if (date_dropped !== undefined) {
      const include_date = target_column !== -1 ? true : false;
      this.require_set_date_format = this.updateDateformatOnDragulaDrop(header_moved, include_date);
      this.all_date_format_is_set = this.checkDateformatSetOnDragulaDrop();
      // get updated date drop
      this.date_dropped = this.date_formats.find((df: SampleUploadDateFormat)=> { return df.date_attr_label === header_moved });
    } else {
      this.date_dropped = new SampleUploadDateFormat();
      this.date_dropped.format = this.setDefaultDateFormat();
    }
  }
  // update date formats on drop
  // return: if all not required/false, then required, otherwise require/true
  updateDateformatOnDragulaDrop(header_moved: string, include_date: boolean): boolean {
    const date_dropped_index = this.date_formats.findIndex((df: SampleUploadDateFormat)=> { return df.date_attr_label === header_moved });
    if (date_dropped_index !== -1) {
      this.date_formats[date_dropped_index].date_date_included = include_date;
      this.date_formats[date_dropped_index].date_format_is_set = false;
      this.date_formats[date_dropped_index].format = this.setDefaultDateFormat();
    } 
    // check the status
    const date_dropped = this.date_formats.find((df: SampleUploadDateFormat)=> { return df.date_date_included === true })
      if (date_dropped !== undefined) {
        return true;
      } else {
        return false;
      }
  }
  // check all_date_format_is_set
  checkDateformatSetOnDragulaDrop(): boolean {
    const date_dropped = this.date_formats.find((df: SampleUploadDateFormat)=> { return df.date_date_included === true && df.date_format_is_set === false })
      if (date_dropped !== undefined) {
        return false;
      } else {
        return true;
      }
  }

  private onDragulaDateDrop(el_id: string, sb_id: string) {
    // gen array
    const array = [];
    array[(this.date_dropped.format['year_position'] - 1)] = 'year';
    array[(this.date_dropped.format['month_position'] - 1)] = 'month';
    array[(this.date_dropped.format['day_position'] - 1)] = 'day';
    // find the index of the el
    const el_index = array.indexOf(el_id);
    array.splice(el_index, 1);
    if (sb_id === 'no-drop') {
      array.push(el_id);
    } else {
      // find the sb_id index
      const sb_index = array.indexOf(sb_id);
      array.splice(sb_index, 0, el_id);
    }
    // update
    this.date_dropped.format['year_position'] = array.indexOf('year') + 1;
    this.date_dropped.format['month_position'] = array.indexOf('month') + 1;
    this.date_dropped.format['day_position'] = array.indexOf('day') + 1;
  }

  handleValidFileDrop(evt: Array<File>) {
    this.parsing_file = true;
    this.uploaded = false;
    this.no_valid_sample = false;
    this.excel_parse_failed = false;
    this.xlsxHelperService.parseDrop(evt, this.rABS, this.fileName)
    .subscribe(
      (data: Array<Array<any>>) => {
        this.excelRawData = data;
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
        // console.log(this.data);
      },
      (err: string) => {
        // console.log(err);
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
    this.column_headers = 
    this.USE_CSAMPLE
    ? this.updateCTypeColumnHeaders(this.sample_type, this.ctypes, this.bLabel, this.sLabel)
    : this.updateColumnHeaders(this.sample_type, this.bLabel, this.sLabel);
    this.column_headers.sort();
    // prepare the default column attrs
    this.setDefaultColumnAttrs();
  }

  toggleExcelFilerHeader() {
    this.excel_file_has_header = !this.excel_file_has_header;
  }

  setDefaultSampleFile() {
    this.sample_type = 
    this.USE_CSAMPLE
    ? (this.sample_types.length > 0 ? this.sample_types[0]: '')
    :'GENERAL';
    this.excel_file_has_header = true;
    this.column_header_is_set = false;
    this.all_set_start_to_upload_file = false;
    this.excel_parse_failed = false;
    this.no_valid_sample = false;
    this.parsing_file = false;
    // this.freezing_date_included = false;
    // this.freezing_date_format_is_set = false;
    this.date_dropped.format = this.setDefaultDateFormat();
    this.require_set_date_format = false;
    this.all_date_format_is_set = false;
    // set up column count and headers
    this.column_headers = this.USE_CSAMPLE
    ? this.updateCTypeColumnHeaders(this.sample_type, this.ctypes, this.bLabel, this.sLabel)
    : this.updateColumnHeaders(this.sample_type, this.bLabel, this.sLabel);
    this.column_headers.sort();
    this.setDefaultColumnAttrs();
  }
  // use CSAMPLE
  updateCTypeColumnHeaders(sample_type: string, ctypes: Array<CType>, bLabel: BoxLabel, sLabel: SampleLabel) {
    let col_headers: Array<string> = [];
    // get shared excel headers
    const shared_headers: Array<SampleExcelHeaders> = this.excelUploadLoadService.getSharedExcelHeaders();
    // box label
    const box_label_headers = shared_headers.find(h => h.header_type === 'box_position').headers;
    if (bLabel.box_has_label) {
      if (bLabel.box_defined_as_normal && bLabel.box_tsb_one_column) {
        col_headers.push(box_label_headers[0]);
        // 1 col for box label
      }
      if (bLabel.box_defined_as_normal && !bLabel.box_tsb_one_column) {
        col_headers.push(box_label_headers[1]);
        col_headers.push(box_label_headers[2]);
        col_headers.push(box_label_headers[3]);
        // 3 col for box label
      }
      if (!bLabel.box_defined_as_normal && bLabel.box_sample_separated) {
        // 1 col for box label
        col_headers.push(box_label_headers[0]);
      }
    }
    // sample label
    const sample_label_headers = shared_headers.find(h => h.header_type === 'sample_position').headers;
    if (sLabel.sampleLabelDefinition === 1) {
      // 2 cols for sample label
      col_headers.push(sample_label_headers[1]);
      col_headers.push(sample_label_headers[2]);

    } else {
      // 1 col for sample label
      col_headers.push(sample_label_headers[0]);
    }
    // get the minial headers
    const minimal_headers: Array<string> = shared_headers.find(h => h.header_type === 'minimal_attrs').headers;
    // get ctype parental attrs
    const ctype_pattrs: Array<string> = this.ctypeService.getCTypePAttrs(sample_type, ctypes, false); // false is to load labels
    col_headers = [...col_headers, ...minimal_headers, ...ctype_pattrs]
    return col_headers;
  }

  // use old sample type
  updateColumnHeaders (sample_type: string, bLabel: BoxLabel, sLabel: SampleLabel): Array<string> {
    const all_headers: Array<SampleExcelHeaders> = this.excelUploadLoadService.getAllExcelHeaders();
    let sample_headers: Array<string> = [];
    // box label
    const box_label_headers = all_headers.filter(h => h.header_type === 'box_position')[0].headers;
    if (bLabel.box_has_label) {
      if (bLabel.box_defined_as_normal && bLabel.box_tsb_one_column) {
        sample_headers.push(box_label_headers[0]);
        // 1 col for box label
      }
      if (bLabel.box_defined_as_normal && !bLabel.box_tsb_one_column) {
        sample_headers.push(box_label_headers[1]);
        sample_headers.push(box_label_headers[2]);
        sample_headers.push(box_label_headers[3]);
        // 3 col for box label
      }
      if (!bLabel.box_defined_as_normal && bLabel.box_sample_separated) {
        // 1 col for box label
        sample_headers.push(box_label_headers[0]);
      }
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
    const defaultColumnHeaders = this.USE_CSAMPLE
    ? this.updateCTypeColumnHeaders(this.sample_type, this.ctypes, this.bLabel, this.sLabel)
    : this.excelUploadLoadService.getAllColumnHeaders();
    this.column_headers.forEach((h: string) => {
      // get the index of current header
      const col_index = defaultColumnHeaders.indexOf(h);
      if (col_index !== -1) {
        const columnAttr = new ColumnAttr();
        columnAttr.col_header = h;
        columnAttr.col_number = -1;
        columnAttr.sample_attr_index = col_index; // use this to map to sample table attr
        this.excelColAttrs.push(columnAttr);
      }
    });
    // find the freezing date sample_attr_index
    // this.freezing_date_sample_attr_index = this.getFreezingDateSampleModelIndex();
    // preapre the freezing date format
    // this.setDefaultFreezingDateFormat();
    // get all the date formats
    this.date_formats = this.genDefaultDateFormats(this.USE_CSAMPLE);
    // set all date format is set false
    this.require_set_date_format = false;
    this.all_date_format_is_set = false;
  }
  // gen default date_formats
  genDefaultDateFormats(USE_CSAMPLE): Array<SampleUploadDateFormat> {
    const date_formats = new Array<SampleUploadDateFormat>();

    if (USE_CSAMPLE) {
      // storage date
      const sotrage_date_format = new SampleUploadDateFormat();
      sotrage_date_format.date_attr_label = this.utilityService.getCustomizedSampleAttrLabel('storage_date');
      sotrage_date_format.date_date_included = false;
      sotrage_date_format.date_format_is_set = false;
      sotrage_date_format.date_attr_index = this.getCSampleLabelIndex(this.utilityService.getCustomizedSampleAttrLabel('storage_date'));
      sotrage_date_format.format = this.setDefaultDateFormat();
      date_formats.push(sotrage_date_format);
      // extra date fields
      // get ctype parental data attr labels
      const ctype_pattrs: Array<string> = this.ctypeService.getCTypsPDateAttrs(this.sample_type, this.ctypes, false); // false is to load labels
      ctype_pattrs.forEach((a: string) => {
        const date_format = new SampleUploadDateFormat();
        date_format.date_attr_label = a;
        date_format.date_date_included = false;
        date_format.date_format_is_set = false;
        date_format.date_attr_index = this.getCSampleLabelIndex(a);
        date_format.format = this.setDefaultDateFormat();
        date_formats.push(date_format);
      })
    } else {
      const freezing_date_format = new SampleUploadDateFormat();
      freezing_date_format.date_attr_label = this.FREEZING_DATE;
      freezing_date_format.date_date_included = false;
      freezing_date_format.date_format_is_set = false;
      freezing_date_format.date_attr_index = this.getFreezingDateSampleModelIndex();
      freezing_date_format.format = this.setDefaultDateFormat();
      date_formats.push(freezing_date_format);
    }
    return date_formats;
  }
  // get attr_index by label
  getCSampleLabelIndex(label: string): number {
    return this.column_headers.indexOf(label);
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
    const allColumnHeaders = this.excelUploadLoadService.getAllColumnHeaders();
    return allColumnHeaders.indexOf(this.FREEZING_DATE);
  }
  // // set up the default freezing_date_format
  // setDefaultFreezingDateFormat(): void {
  //   this.freezing_date_format.day_position = 3;
  //   this.freezing_date_format.month_position = 2;
  //   this.freezing_date_format.year_position = 1;
  //   this.freezing_date_format.join_symbol = '-';
  //   this.freezing_date_format.month_format = 0; // nummeric
  //   this.freezing_date_format.year_format = 0; // yyyy
  // }
  // set the default date format
  setDefaultDateFormat(): SampleDateFormat {
    const format = new SampleDateFormat();
    format.day_position = 3;
    format.month_position = 2;
    format.year_position = 1;
    format.join_symbol = '-';
    format.month_format = 0; // nummeric
    format.year_format = 0; // yyyy
    return format;
  }
  // // set freezing_date_format upon draged into the table
  // updateFreezingDateFormat(type: string, value: any): void {
  //   this.freezing_date_format[type] = value;
  // }
  // update dropped date format
  updateDateFormat(type: string, value: any): void {
    this.date_dropped.format[type] = value;
  }
  // display formated date
  displayDateFormat() {
    return this.excelUploadLoadService.displayDateFormat(this.date_dropped.format);
  }
  doneDateFormat() {
    // this.freezing_date_format_is_set = true;
    // sync the set date format
    const date_index = this.date_formats.findIndex((df: SampleUploadDateFormat)=> { return df.date_attr_label === this.date_dropped.date_attr_label; });
    if(date_index !== -1) {
      this.date_formats[date_index].date_format_is_set = true;
      this.date_formats[date_index].format.day_position = this.date_dropped.format.day_position;
      this.date_formats[date_index].format.join_symbol = this.date_dropped.format.join_symbol;
      this.date_formats[date_index].format.month_format = this.date_dropped.format.month_format;
      this.date_formats[date_index].format.month_position = this.date_dropped.format.month_position;
      this.date_formats[date_index].format.year_format = this.date_dropped.format.year_format;
      this.date_formats[date_index].format.year_position = this.date_dropped.format.year_position;
    }
    this.date_dropped = new SampleUploadDateFormat();
    this.date_dropped.format = this.setDefaultDateFormat();


  }
  // doneFreezingDateFormat() {
  //   this.freezing_date_format_is_set = true;
  // }
  doneColumnHeaders() {
    this.all_set_start_to_upload_file = true;
  }
  ///////////// DONOT CHANGE THIS /////////////////
  getRequiredColumnHeader() {
    const shared_headers: Array<SampleExcelHeaders> = this.excelUploadLoadService.getSharedExcelHeaders();
    let box_label_headers = [];
    if (this.bLabel.box_has_label) {
      box_label_headers = shared_headers.find(h => h.header_type === 'box_position').headers;
    }
    const sample_label_headers = shared_headers.find(h => h.header_type === 'sample_position').headers;
    if(this.USE_CSAMPLE) {
      return [...box_label_headers, ...sample_label_headers, this.utilityService.getCustomizedSampleAttrLabel('name')];
    } else {
      return [...box_label_headers, ...sample_label_headers, 'Name'];
    }
  }
  ngOnDestroy() {
    if (this.dragulaDrop$ !== undefined) {
      this.dragulaDrop$.unsubscribe();
    }
  }
  parseLetter2Number(letter: string) {
    return this.appSetting.BOX_POSITION_LETTERS.indexOf(letter.toUpperCase()) + 1;
  }
  genOneorA(value: number) {
    if ( +value === 1) { return 1 } else { return 'A'; }
  }
  ngOnChanges() {
    this.column_headers = this.USE_CSAMPLE
    ? this.updateCTypeColumnHeaders(this.sample_type, this.ctypes, this.bLabel, this.sLabel)
    : this.updateColumnHeaders(this.sample_type, this.bLabel, this.sLabel);
    this.column_headers.sort();
    this.all_requied_headers = this.getRequiredColumnHeader();
    this.setDefaultColumnAttrs();
  }
  validateSampleUpload () {
    this.excelData.emit(this.excelRawData);
    this.colAttrs.emit(this.excelColAttrs);
    this.freezingDateFormat.emit(this.date_dropped.format);
    this.excelHasFileHeader.emit(this.excel_file_has_header);
    this.sampleType.emit(this.sample_type);
  }
}
// need to check these
// bLabel, sLabel, freezing_date_format, excelColAttrs
// this.data
