import { Component, Inject, OnInit, Input, OnChanges, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { BoxLabel, SampleLabel, ColumnAttr, SampleFile, SampleExcelHeaders, SampleDateFormat, SampleUploadDateFormat,
  SampleValidator, ValidatorOutput } from '../../_classes/SampleUpload';
  import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';
import { Container } from '../../_classes/Container';
import { Box } from '../../_classes/Box';
import { UploadSample, Sample } from '../../_classes/Sample';
import { UtilityService } from '../../_services/UtilityService';
import { ExcelUploadLoadService } from '../../_services/ExcelUploadLoadService';
import { BookType } from 'xlsx/types';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { XlsxHelperService } from '../../_services/XlsxHelperService';
import { ContainerService } from '../../_services/ContainerService';
import { AlertService } from '../../_services/AlertService';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
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
  @Input() dateFormats: Array<SampleUploadDateFormat>;
  @Input() startValidation: Boolean;
  @Input() excelFileHeader: Boolean;
  @Input() sampleType: string;
  container: Container;
  row_indexes_to_remove: Array<number> = []; // rows that failed the validation, only for validaiton messages
  boxes_to_create: Array<Array<number>> = []; // for following tower-shelf-box
  abnormal_boxes_to_create: Array<any> = []; // for not following tower-shelf-box
  // final boxes to create before API call
  final_boxes_to_create: Array<Array<number>> = [];
  validator_under_going = true;
  saving_sample_posting_validation = false;
  validator_failed = false;
  validation_finished = false;
  double_checked = false;
  saving_samples = false;
  saving_samples_failed = false;
  sampleValidator: SampleValidator = new SampleValidator();
  data: Array<Array<any>> []; // for keep the origin nal copy
  validation_step = 'validator initiated ...';
  // step subject
  valiadtionStep$: Subject<string> = new Subject<string>();
  // validator output subject
  valdatorOutput$: Subject<ValidatorOutput> = new Subject<ValidatorOutput>();
  // implement auto scroll to bottom
  @ViewChild('messageBox') private messageBox: ElementRef;
  // consts
  SAMPLEPOSITION = 'SamplePosition';
  BOXPOSITION = 'BoxPosition';
  // freezing_date
  FREEZING_DATE = 'Freezing Date';
  FREEZING_DATE_INDEX = -1;
  // some consts
  VALIDATION_SAMPLE_NAME = 'validating sample names ...';
  VALIDATION_BOX_LABEL = 'validating box labels ...';
  VALIDATION_SAMPLE_LABEL = 'validating sample labels ...';
  VALIDATION_SAMPLE_COUNT = 'validating the number of samples ...';
  VALIDAITON_CHECKING = 'validation step reporting ...';
  VALIDAITON_BOXES_TO_CREATE_CHECKING = 'generate boxes to create ...';
  VALIDAITON_DATEFORMAT = 'validation date format ...';
  // the col attr to ignore for the final data format
  excludedColumns4DataFormat: Array<string> = [];
  // for down load checking
  fileName = 'Samples.xlsx';
  worksheet_name = 'sheet';
  rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
  col_offset = 0; // for get the correct col number
  allow_save_2_json = false;
  constructor(@Inject(AppStore) private appStore, private utilityService: UtilityService, private alertService: AlertService,
              private excelUploadLoadService: ExcelUploadLoadService, private containerService: ContainerService,
              private router: Router, private xlsxHelperService: XlsxHelperService, @Inject(APP_CONFIG) private appSetting: any) {
    // subscribe store state changes
    appStore.subscribe(() => this.updateState());
    this.updateState();
    this.sampleValidator.validation_steps = [
      this.VALIDATION_SAMPLE_NAME,
      this.VALIDATION_BOX_LABEL,
      this.VALIDATION_SAMPLE_LABEL,
      this.VALIDAITON_DATEFORMAT
    ];
    this.sampleValidator.validation_steps_icons = ['grid layout'];
    this.sampleValidator.validator_pointer = 0;
    this.sampleValidator.validation_status = true;
    this.sampleValidator.validator_outputs = new Array<ValidatorOutput>();
    // allow save 2 json for manually upload
    this.allow_save_2_json = this.appSetting.ALLOW_UPLOAD_SAMPLE_2_JSON;
    // emit step
    this.valiadtionStep$
    .subscribe(
      (step: string) => this.validation_step = step,
      err => console.log(err)
    );
    // emit valdatorOutput
    this.valdatorOutput$
    .subscribe(
      (outout: ValidatorOutput) => {
        this.sampleValidator.validator_outputs.push(outout);
        // this.scrollToBottom();
      }, () => {});
   }

  ngOnInit() {}
  updateState() {
    const state = this.appStore.getState();
    if (state.containerInfo && state.containerInfo.currentContainer) {
      this.container = state.containerInfo.currentContainer;
    }
  }
  ngOnChanges() {
    if (this.startValidation) {
      // console.log(this.freezingDateFormat);
      // console.log(this.excelColAttrs);
      // console.log(this.excelData);
      this.data = this.excelData;
      this.sampleValidation();
    }
  }
  // box label validation
  // aim is to check box labels and return the valid boxes, boxes to create, row_index_to_remove
  sampleValidation () {
    // trim the top empty rows data and get row_offset
    this.trimDataCalOffset();
    // excel file header
    if (this.excelFileHeader) {
      this.data[0]['invalid'] = true;
      this.col_offset += 1;
    };
    ///////////////////////////////// validate initial data set ///////////////////////////////
    // if this.data.length === 0
    this.validateDataLength(true); // inital data set validation
    ///////////////////////////////// validate sample name ////////////////////////////////////
    // validate name col
    if (!this.validator_failed && this.data.length > 0) {
      this.validateSampleName();
    }
    ///////////////////////////////// validate box label ////////////////////////////////////////
    // only when the file has box label
    if (!this.validator_failed && this.bLabel.box_has_label && this.data.length > 0) {
      // step one check box label
      this.validateBoxLabel();
    }
    if (!this.validator_failed && !this.bLabel.box_has_label) {
      // no box validation is required
      // sample label is labeled with the increaing number
      const message = 'your samples have no box labels, box label validation is skipped.';
      this.emitValidationOutput(this.VALIDATION_BOX_LABEL, 3, message);
    }
    ///////////////////////////////// validate sample label ////////////////////////////////////////
    if (!this.validator_failed && this.data.length > 0) {
      // valid sample labels after box label
      this.validateSampleLabel();
    }
    // valiate date format /////////////
    // check whether there is freezing_date has been included
    if (!this.validator_failed && this.data.length > 0) {
      this.formatFreezingDate();
      // format all other columns to upload
      this.formatData(); // format and clean data
    }
    // filter the data
    this.data = this.filterValidSamples(this.data);
    this.validateDataLength(false);
    // //////////////////////////re-gen the boxes to create///////////////////////////////////////////
    if (!this.validator_failed && this.data.length > 0) {
      this.final_boxes_to_create = this.collectBoxes2Create();
      this.validateFinalBoxes2Create();
      // format for saving
      this.format4Saving();
    }
    this.passAllValidation();
  }
  trimDataCalOffset() {
    const ori_len = this.data.length;
    // get beginning empty rows
    const beginning_empty_rows = this.getBeginningEmptyRows();
    this.col_offset +=  beginning_empty_rows;
    // trim data
    this.data = this.trimData(this.data);
  }
  getBeginningEmptyRows(): number {
    const ori_len = this.data.length;
    let count = 0;
    for (let i = 0; i < ori_len; i++) {
      if (this.data[i].length === 0) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }
  trimData (data: Array<Array<any>>): Array<Array<any>> {
    return data.filter((d: Array<any>) => {
      return d.length > 0;
    })
  }
  // validate samle names
  validateSampleName () {
    // set pointer
    this.sampleValidator.validator_pointer = 0;
    // emit step
    this.valiadtionStep$.next(this.getValidationStep(this.sampleValidator.validator_pointer));
    // emit messages
    const message = 'start to validate sample names ...';
    this.emitValidationOutput(this.VALIDATION_SAMPLE_NAME, 3, message);
    // parse box labels
    const sample_name_validation_output = this.parseSampleName();
    this.checkValidationOutcome(sample_name_validation_output, 'sample names');
  }
  // box label validation
  validateBoxLabel() {
    // set pointer
    this.sampleValidator.validator_pointer = 1;
    // emit step
    this.valiadtionStep$.next(this.getValidationStep(this.sampleValidator.validator_pointer));
    // emit messages
    const message_step = this.VALIDATION_BOX_LABEL;
    let message = 'start to validate box labels ...';
    this.emitValidationOutput(message_step, 3, message);
    // emit messages
    message = this.bLabel.box_defined_as_normal
      ? 'your boxes are labeled following the pattern of "TOWER-SHELF-BOX"'
      : 'your boxes are labeled NOT following the pattern of "TOWER-SHELF-BOX"';
    this.emitValidationOutput(message_step, 3, message);
    // emit messages
    if (this.bLabel.box_defined_as_normal) {
      if (this.bLabel.box_tsb_one_column) {
        // one cloumn
        message = 'your box labels are stored in one column (column ' + this.getColumnByHeader(this.BOXPOSITION) + ')';
        this.emitValidationOutput(message_step, 3, message);
        // validate the BoxPosition
        // format box label
        message = 'validate box labels (column ' + this.getColumnByHeader(this.BOXPOSITION) + ') ...';
        this.emitValidationOutput(message_step, 3, message);
      } else {
        // 3 columns
        message = 'your box labels are stored in three columns (tower in column '
        + this.getColumnByHeader(this.BOXPOSITION + '_Tower') + ', '
        + 'shelf in column ' + this.getColumnByHeader(this.BOXPOSITION + '_Shelf') + ', '
        + 'box in column ' + this.getColumnByHeader(this.BOXPOSITION + '_Box') + ')';
        this.emitValidationOutput(message_step, 3, message);
      }
    } else {
      // box defined abnormal
      if (this.bLabel.box_sample_separated) {
        // box label is seperated
        message = 'your box labels are stored in one column (column ' + this.getColumnByHeader(this.BOXPOSITION)
        + ') and seperated from sample labels';
        this.emitValidationOutput(message_step, 3, message);
      } else {
        // box label together with sample label
        message = 'your box labels are stored in one column (column ' + this.getColumnByHeader(this.SAMPLEPOSITION)
        + ') and integrated with sample labels';
        this.emitValidationOutput(message_step, 3, message);
      }
    }
    // parse box labels
    const box_label_validation_output = this.parseBoxLabel();
    this.checkValidationOutcome(box_label_validation_output, 'box labels');
  }
  // filter samples for valid
  filterValidSamples(data: Array<Array<any>>) {
    return data.filter( (d: Array<any>) => {
      return d['invalid'] === undefined || d['invalid'] === false;
    })
  }
  // sample label validaiton
  validateSampleLabel() {
    // set pointer
    this.sampleValidator.validator_pointer = 2;
    // emit step
    this.valiadtionStep$.next(this.getValidationStep(this.sampleValidator.validator_pointer));
    // emit messages
    const message = 'start to validate sample labels ...';
    this.emitValidationOutput(this.VALIDATION_SAMPLE_LABEL, 3, message);
    // final check
    // parse box labels
    const sample_label_validation_output = this.parseSampleLabel();
    this.checkValidationOutcome(sample_label_validation_output, 'sample labels');
  }
  // validate freezingdate
  formatFreezingDate() {
    // set pointer
    this.sampleValidator.validator_pointer = 3;
    // emit step
    this.valiadtionStep$.next(this.getValidationStep(this.sampleValidator.validator_pointer));
    // check wether freezing date is included
    let freezing_date_included = false;
    this.excelColAttrs.forEach((c, i) => {
      if (c.col_header === this.FREEZING_DATE && c.col_number > 0 ) {
        freezing_date_included = true;
        this.FREEZING_DATE_INDEX = c.sample_attr_index;
      }
    })
    if (freezing_date_included) {
      // emit message
      let message = 'start to validate date format ...';
      this.emitValidationOutput(this.VALIDAITON_DATEFORMAT, 3, message);
      // get the date format
      message = 'your date should like this: ' + this.excelUploadLoadService.displayFreezingDate(this.freezingDateFormat);
      this.emitValidationOutput(this.VALIDAITON_DATEFORMAT, 3, message);
      // format Data
      const date_formating_validation_output = this.formatDate();
      this.checkValidationOutcome(date_formating_validation_output, 'date format');
    }
  }
  formatDate(): number {
    let output = 0;
    let has_warning = false;
    const freezing_date_col = this.getColumnByHeader(this.FREEZING_DATE);
    this.data.forEach((d: Array<any>, i) => {
      const freezing_date = d[( '' + (freezing_date_col - 1) )];
      if (freezing_date === undefined || freezing_date === null  || freezing_date === '') {
        has_warning = true;
        d['freezing_date'] = null;
        output = 1;
        // emit warning
        const message = 'invalid date or date not recognizable for row ' + (i + 1 ) +
                        ', this sample will be saved with an date of today!';
        this.emitValidationOutput(this.VALIDAITON_DATEFORMAT, 1, message);
      } else {
        // test date
        const parsedDate = this.parseDate(freezing_date);
        if (parsedDate === '') {
          has_warning = true;
          output = 1;
          d['freezing_date'] = this.utilityService.getTodayFormat;
          // emit warning
          const message = 'invalid date or date not recognizable  for row ' + (i + 1 ) +
                          ', this sample will be saved with an date of today!';
          this.emitValidationOutput(this.VALIDAITON_DATEFORMAT, 1, message);
        } else {
          d['freezing_date'] = parsedDate;
        }
      }
    });
    return output;
  }
  parseDate (freezing_date: string): string {
    const join_symbol = this.freezingDateFormat.join_symbol;
    let year_final: string;
    let month_final: string;
    let day_final: string;
    if (join_symbol !== '') {
      if (freezing_date.indexOf(join_symbol) !== -1 &&  freezing_date.split(join_symbol).length === 3) {
        // splite
        const dArray = freezing_date.split(join_symbol);
        let year_valid = false;
        let month_valid = false;
        let day_valid = false;
        // get the year
        const year = dArray[this.freezingDateFormat.year_position - 1];
        if (this.freezingDateFormat.year_format === 0) {
          // yyyy
          year_valid = (/^([0-9]+){4}$/.test(year));
          if (year_valid) {
            year_final = year;
          }
        } else {
          // yy
          year_valid = (/^([0-9]+){2}$/.test(year));
          if (year_valid) {
            year_final = 20 + year;
          }
        }
        // get the month
        const month = dArray[this.freezingDateFormat.month_position - 1];
        if (this.freezingDateFormat.month_format === 0) {
          // number
          month_valid = (/^([0-9]+){1,2}$/.test(month)) && +month > 0 && + month < 13;
          if (month_valid) {
            month_final = month.length === 2 ? month : '0' + month;
          }
        } else {
          // 3 or 5 letters
          month_valid = (/^([a-zA-Z]+){3,9}$/.test(month)) && +month > 0 && + month < 13;
          if (month_valid) {
            const month_number = this.utilityService.getMonthNumber(month);
            if (month_number !== -1) {
              const monthStrng = month_number + '';
              month_final = monthStrng.length === 2 ? monthStrng : '0' + monthStrng;
            } else {
              month_valid = false;
            }
          }
        }
        // get the day
        const day = dArray[this.freezingDateFormat.day_position - 1];
        day_valid = (/^([0-9]+){1,2}$/.test(day)) && +day > 0 && +day < 32;
        if (day_valid) {
          day_final = day.length === 2 ? day : '0' + day;
        }
        if (year_valid && month_valid && day_valid) {
          return year_final + '-' + month_final + '-' + day_final;
        }
      }
    } else {
      // join === ''
        // check the year since it number
        let year = '';
        let month = '';
        let day = '';
        if ((freezing_date.length < 6 && this.freezingDateFormat.year_format === 0)
        ||  (freezing_date.length < 4 && this.freezingDateFormat.year_format === 1)) {
          return '';
        }
        // join_symbol === ''
        let left = '';
        // year in the beginning
        if (this.freezingDateFormat.year_position === 1) {
          if (this.freezingDateFormat.year_format === 0) {
            // yyyy
            year = freezing_date.substring(0, 4);
            left = freezing_date.substring(4);
          } else {
            // 2
            year = 20 + freezing_date.substring(0, 2);
            left = freezing_date.substring(2);
          }
          // month and day
          if (this.freezingDateFormat.month_position === 2) {
            if (this.freezingDateFormat.month_format === 0) {
              // number
              if (left.length === 2) {
                // 11
                month = left.substring(0, 1);
                day = left.substring(1);
              } else if (left.length === 3) {
                  if (left.startsWith('0')) {
                    month = left.substring(0, 2);
                    day = left.substring(2);
                  }
                  if (left.endsWith('0')) {
                    month = left.substring(0, 1);
                    day = left.substring(1);
                  }
              } else {
                // 4
                month = left.substring(0, 2);
                day = left.substring(2);
              }
            } else {
              // letter
              const left_copy = left;
              month = left.replace(/[0-9]/g, '');
              month = this.utilityService.getMonthNumber(month) + '';
              day = left_copy.replace(/\D/g, '');
            }
          }
          if (this.freezingDateFormat.month_position === 3) {
            if (this.freezingDateFormat.month_format === 0) {
              // number
              if (left.startsWith('0')) {
                day = left.substring(0, 2);
                month = left.substring(2);
              }
              if (left.endsWith('0')) {
                day = left.substring(0, 1);
                month = left.substring(1);
              }
            } else {
              // letter
              const left_copy = left;
              month = left.replace(/[0-9]/g, '');
              month = this.utilityService.getMonthNumber(month) + '';
              day = left_copy.replace(/\D/g, '');
            }
          }
        } else if (this.freezingDateFormat.year_position === 3) {
          if (this.freezingDateFormat.year_format === 0) {
            // yyyy
            year = freezing_date.substring(freezing_date.length - 4, freezing_date.length);
            left = freezing_date.substring(0, freezing_date.length - 4);
          } else {
            // 2
            year = 20 + freezing_date.substring(freezing_date.length - 2, freezing_date.length);
            left = freezing_date.substring(0, freezing_date.length - 2);
          }
          // month and day
          if (this.freezingDateFormat.month_position === 1) {
            if (this.freezingDateFormat.month_format === 0) {
              // number
              if (left.length === 2) {
                // 11
                month = left.substring(0, 1);
                day = left.substring(1);
              } else if (left.length === 3) {
                  if (left.startsWith('0')) {
                    month = left.substring(0, 2);
                    day = left.substring(2);
                  }
                  if (left.endsWith('0')) {
                    month = left.substring(0, 1);
                    day = left.substring(1);
                  }
              } else {
                // 4
                month = left.substring(0, 2);
                day = left.substring(2);
              }
            } else {
              // letter
              const left_copy = left;
              month = left.replace(/[0-9]/g, '');
              month = this.utilityService.getMonthNumber(month) + '';
              day = left_copy.replace(/\D/g, '');
            }
          }
          if (this.freezingDateFormat.month_position === 2) {
            if (this.freezingDateFormat.month_format === 0) {
              // number
              if (left.startsWith('0')) {
                day = left.substring(0, 2);
                month = left.substring(2);
              }
              if (left.endsWith('0')) {
                day = left.substring(0, 1);
                month = left.substring(1);
              }
            } else {
              // letter
              const left_copy = left;
              month = left.replace(/[0-9]/g, '');
              month = this.utilityService.getMonthNumber(month) + '';
              day = left_copy.replace(/\D/g, '');
            }
          }
        } else {
          // year in the middle
          // donot support this
        }
        if (year !== '' && month !== '' && day !== '' ) {
          if (  (/^([0-9]+){2,4}$/.test(year))
              && ((/^([0-9]+){1,2}$/.test(month)) && +month > 0 && + month < 13)
              && ((/^([0-9]+){1,2}$/.test(day)) && +day > 0 && +day < 32) ) {
            return year_final + '-' + month_final + '-' + day_final;
          }
        }
    }
    return '';
  }
  // general clean the data after all validation
  // format all other columns
  formatData() {
    // remove header
    if (this.excelFileHeader) {
      this.data[0]['invalid'] = true;
    };
    // match data col to sample model attrs
    // the col attr to ignore for the final data format
    // freezing date is always excluded
    this.excludedColumns4DataFormat = this.getExcludedColumns4DataFormat();
    // get all the sample mode attrs
    const sampleModelAttrs: Array<string> = this.excelUploadLoadService.getAllSampleModelAttrs();
    // format data
    this.excelColAttrs.forEach((c: ColumnAttr, i: number) => {
      if (this.excludedColumns4DataFormat.indexOf(c.col_header) === -1) {
        const data_excel_col = c.col_number;
        // sample model attr
        const sample_model_attr = sampleModelAttrs[c.sample_attr_index];
        this.data.forEach(d => {
          const data_col = d[('' + (data_excel_col - 1))];
          if (data_col === '' || data_col === null || data_col === undefined) {
            // add attr
            d[sample_model_attr] = null;
          } else {
            d[sample_model_attr] = this.utilityService.removeSpecialCharacters(data_col);
            // deal with space
            const ori_value = d[sample_model_attr] + '';
            if ( this.utilityService.isSpaceCheck(ori_value) ) {
              d[sample_model_attr] = null;
            }
            // deal with decimal
            if (sample_model_attr.toLowerCase() === 'quantity' && d['quantity'] != null) {
              d['quantity'] = this.utilityService.convert2Float(d['quantity'], 10, 3);
            }
            if (sample_model_attr.toLowerCase() === 'oligo_gc' && d['oligo_GC'] != null) {
              d['oligo_GC'] = this.utilityService.convert2Float(d['oligo_GC'], 10, 2);
            }
            if (sample_model_attr.toLowerCase() === 'against_260_280' && d['against_260_280'] != null) {
              d['against_260_280'] = this.utilityService.convert2Float(d['against_260_280'], 10, 2);
            }
            if (sample_model_attr.toLowerCase() === 'oligo_length' && d['oligo_length'] != null) {
              d['oligo_length'] = this.utilityService.convert2Integer(d['oligo_length']);
            }
          }
        })
      }
    });
  }
  getColumnByHeader(header: string): number {
    const cols = this.excelColAttrs.filter(attr => attr.col_header === header);
    if (cols.length > 0) {
      return cols[0].col_number;
    } else {
      return -1;
    }
  }
  getValidationStep(index: number): string {
    return this.sampleValidator.validation_steps[index];
  }
  getIconbyStatus (status: number) {
    // 0 passed, 1, passed with warning; 2 failed, 3 info;
    if (status === 0) {
      return 'icon green checkmark';
    } else if (status === 1) {
      return 'icon brown announcement';
    } else if (status === 2 ) {
      return 'icon red warning sign';
    } else {
      return 'icon blue info';
    }
  }
  getColorByStatus(status: number) {
    // 0 passed, 1, passed with warning; 2 failed, 3 info;
    if (status === 0) {
      return 'green-text';
    } else if (status === 1) {
      return 'brown-text';
    } else if (status === 2 ) {
      return 'red-text';
    } else {
      return 'blue-text';
    }
  }
  emitValidationOutput(validation_step: string, status: number, message: string) {
    const msg: ValidatorOutput = new ValidatorOutput();
    msg.validation_step = validation_step;
    msg.status = status;
    msg.message = message;
    this.valdatorOutput$.next(msg);
  }
  parseSampleName(): number {
    let output = 0; // default passed
    const sample_name_col = this.getColumnByHeader('Name'); // sample name is required
    // emit message
    // one cloumn
    const message = 'the sample names are stored in column ' + sample_name_col + '.';
    this.emitValidationOutput(this.VALIDATION_SAMPLE_NAME, 3, message);
    // validate sample names
    this.data.forEach( (d, i) => {
      const sample_name = d[( '' + (sample_name_col - 1) )];
      if (sample_name === '' || sample_name === null || sample_name === undefined ) {
         // sample is null, sample invalid
         d['invalid'] = true;
         this.updateRowToRemove4SampleNameValidation(i);
         output = 1;
      } else {
        // remove space
        if (sample_name.replace(/\s/g, '').length > 0) {
          d['name'] = sample_name;
          // d['invalid'] = false;
        } else {
          // sample is only space, sample invalid
         d['invalid'] = true;
         this.updateRowToRemove4SampleNameValidation(i);
        }
      }
    })
    return output;
  }
  parseBoxLabel(): number {
    // max boxes in the containers
    const max_boxes_of_conatiner = this.getContainerTotalBoxes(this.container);
    let output = 0;
    if (this.bLabel.box_defined_as_normal) {
      // definition for tow, shefl and box
      if (this.bLabel.box_tsb_one_column) {
        // 1 col
        const has_warning = this.validNormal1Col();
        if (has_warning) {
          output = 1;
        }
      } else {
        // 3 cols
        const has_warning = this.validNormal3Col();
        if (has_warning) {
          output = 1;
        }
      }
      // validate box count
      if (this.boxes_to_create.length === 0 ) {
        output = 2;
        const message = 'no box label is valid; no box to create!';
        this.emitValidationOutput(this.VALIDATION_BOX_LABEL, 2, message);
      } else {
        // filter the repeats in the array
        this.boxes_to_create = this.removeRepeatedBoxes(this.boxes_to_create);
        if (this.boxes_to_create.length > max_boxes_of_conatiner) {
          output = 1;
          const message = 'too many boxes founded, not all samples will be uploaded!';
          this.emitValidationOutput(this.VALIDATION_BOX_LABEL, 1, message);
        }
      }
    } else {
      // abnormal
      if (this.bLabel.box_sample_separated) {
        const too_many_samples = this.validAbnormalSeparated();
        if (too_many_samples) {
          output = 1;
        }
      } else {
        // integreted with sample label
        const too_many_samples = this.validAbnormalIntegrated();
        if (too_many_samples) {
          output = 1;
        }
      }
      // validate box count
      if (this.abnormal_boxes_to_create.length === 0) {
        output = 2;
        const message = 'no box label is valid; no box to create!';
        this.emitValidationOutput(this.VALIDATION_BOX_LABEL, 2, message);
      }
      if (this.abnormal_boxes_to_create.length > max_boxes_of_conatiner) {
        output = 1;
        const message = 'too many boxes founded, not all samples will be uploaded!';
        this.emitValidationOutput(this.VALIDATION_BOX_LABEL, 1, message);
      }
    }
    return output;
  }
  parseSampleLabel() {
    let output = 0; // default passed
    if ( !this.bLabel.box_has_label ) {
      // sample label is the increasing number
      this.validSampleLabelIncreasingNumber(false); // !this.bLabel.box_has_label
    } else {
      // row-col in 1 col , 2 cols or increasing number
      if (this.sLabel.sampleLabelDefinition === 0) {
          // row-col in 1 col
        const has_warning = this.validSampleLabel1Col();
        if (has_warning) {
          output = 1;
        }
      } else if (this.sLabel.sampleLabelDefinition === 1) {
        // row-col in 2 cols
        const has_warning = this.validSampleLabel2Col();
        if (has_warning) {
          output = 1;
        }
      } else {
        // this.sLabel.sampleLabelDefinition === 2
        // increasing number
        const has_warning = this.validSampleLabelIncreasingNumber(true);
        if (has_warning) {
          output = 1;
        }
      }
    }
    return output;
  }
  validNormal1Col(): boolean {
    let has_warning = false;
    const box_label_header = this.getColumnByHeader(this.BOXPOSITION);
    // format data and test
    this.data.forEach((d: Array<any>, i) => {
      let box_label = d[('' + (box_label_header - 1))];
      if (box_label === '' || box_label === null || box_label === undefined
        || (d['invalid'] !== undefined && d['invalid'] === true) ) {
        // box label is null, sample invalid
        d['invalid'] = true;
        has_warning = true;
        this.updateRowToRemove4BoxLabelValidation(i);
      } else {
        // get the box label patthern
        // trim the label;
        if (this.bLabel.prefix !== '' && this.bLabel.prefix != null
          && box_label.toLowerCase().startsWith(this.bLabel.prefix.toLowerCase())) {
          const prefix_index = box_label.toLowerCase().indexOf(this.bLabel.prefix.toLowerCase());
          d[('' + (box_label_header - 1))] = box_label.substring(prefix_index);
          box_label = d[('' + (box_label_header - 1))];
        }
        if (this.bLabel.appendix !== '' && this.bLabel.appendix != null
          && box_label.toLowerCase().endsWith(this.bLabel.appendix.toLowerCase())) {
          const appendix_index = box_label.toLowerCase().indexOf(this.bLabel.appendix.toLowerCase());
          d[('' + (box_label_header - 1))] = box_label.substring(0, appendix_index);
          box_label = d[('' + (box_label_header - 1))];
        }
        // test the label, retrun parsed box label array or null
        const label_array = this.testBoxLabel1Col(box_label, this.bLabel, this.container);
        if (label_array.length > 0 && this.testTowerShelfBox(label_array, i)) {
          // validate tower, shelf and box
          d['tower'] = label_array[0];
          d['shelf'] = label_array[1];
          d['box'] = label_array[2];
          // d['invalid'] = false;
          this.boxes_to_create.push(label_array); // need filter out the duplicates later on
        } else {
          d['invalid'] = true;
          has_warning = true;
          this.updateRowToRemove4BoxLabelValidation(i);
        }
      }
    })
    return has_warning;
  }
  validNormal3Col(): boolean {
    let has_warning = false;
    const box_label_tower = this.getColumnByHeader(this.BOXPOSITION + '_Tower');
    const box_label_shelf = this.getColumnByHeader(this.BOXPOSITION + '_Shelf');
    const box_label_box = this.getColumnByHeader(this.BOXPOSITION + '_Box');
    this.data.forEach( (d: Array<any>, i) => {
      if ( d[( '' + (box_label_tower - 1) )] === null || d[( '' + (box_label_tower - 1) )] === undefined
        || d[( '' + (box_label_shelf - 1) )] === null || d[( '' + (box_label_shelf - 1) )] === undefined
        || d[( '' + (box_label_box - 1) )] === null || d[( '' + (box_label_box - 1) )] === undefined
        || (d['invalid'] !== undefined && d['invalid'] === true) ) {
        d['invalid'] = true;
        has_warning = true;
        this.updateRowToRemove4BoxLabelValidation(i);
      } else {
        const lArray: Array<string> = [ d[( '' + (box_label_tower - 1) )],
        d[( '' + (box_label_shelf - 1) )], d[( '' + (box_label_box - 1) )]];
        const label_array = this.testBoxLabel3Col(lArray, this.bLabel, this.container);
        if (label_array.length > 0) {
          // validate tower, shelf and box
          if ( this.testTowerShelfBox(label_array, i)) {
            d['tower'] = label_array[0];
            d['shelf'] = label_array[1];
            d['box'] = label_array[2];
            // d['invalid'] = false;
            this.boxes_to_create.push(label_array); // need filter out the duplicates later on
          } else {
            d['invalid'] = true;
            has_warning = true;
            this.updateRowToRemove4BoxLabelValidation(i);
          }
        } else {
          d['invalid'] = true;
          has_warning = true;
          this.updateRowToRemove4BoxLabelValidation(i);
        }
      }
    });
    return has_warning;
  }
  validAbnormalSeparated(): boolean {
    let too_many_samples = false;
    // seperated with sample
    if ( this.data.length > this.getContainerCapacity(this.sLabel, this.container)) {
      // dn not mark samples as invalid, will be checked during sample label validation
      const message = 'too many samples sample uploaded, not all samples will be uploaded!';
      this.emitValidationOutput(this.VALIDATION_BOX_LABEL, 1, message);
      too_many_samples = true;
    };
    // validate max boxes
    const box_label_header = this.getColumnByHeader(this.BOXPOSITION);
    this.data.forEach((d, i) => {
      const box_label = '' + d[( '' + (box_label_header - 1) )];
      if (box_label === '' || box_label === null || box_label === undefined
        || (d['invalid'] !== undefined && d['invalid'] === true) ) {
        // box label is null, sample invalid
        d['invalid'] = true;
        this.updateRowToRemove4BoxLabelValidation(i);
      } else {
        if (this.abnormal_boxes_to_create.indexOf(box_label.replace(/\s/g, '').toLowerCase()) === -1 ) {
          this.abnormal_boxes_to_create.push(box_label.replace(/\s/g, '').toLowerCase()); // no repeats
        }
      }
    });
    // update tower, shelf and box attrs
    this.genAbnormalBoxLabelInfo(box_label_header, this.container, true);
    return too_many_samples;
  }
  validAbnormalIntegrated(): boolean {
    let too_many_samples = false;
    // emit message
    if ( this.data.length > this.getContainerCapacity(this.sLabel, this.container)) {
      const message = 'too many samples sample uploaded, not all samples will be uploaded!';
      this.emitValidationOutput(this.VALIDATION_BOX_LABEL, 1, message);
      too_many_samples = true;
    }
    // box label is validated with sample labels
    // first need to seperate box labels and sample labels
    // box and sample label must be seperated with a symbol
    // split the box label and sample label ///////////////////////////////////////////////
    const sample_header_col = this.getColumnByHeader(this.SAMPLEPOSITION);
    this.data.forEach( (d, i) => {
      const sample_label = '' + d[( '' + (sample_header_col - 1) )];
      // splite the sample label to get the box label
      // box_join cannot be nothing except when sampleLabelDefinition === 2
      const box_join = this.sLabel.boxJoin;
      if (this.sLabel.sampleLabelDefinition === 0) {
        // sample label is with row and column
        if ( box_join === '' || box_join === null ) {
          d['invalid'] = true;
          // add row to remove
          this.updateRowToRemove4BoxLabelValidation(i);
        } else {
          // sample label is with row and column
          if (sample_label !== undefined && sample_label !== null && sample_label.lastIndexOf(box_join) !== -1
              && sample_label.length === sample_label.lastIndexOf(box_join) + 1) {
            const box_label = sample_label.substring(0, sample_label.lastIndexOf(box_join)); // only accept last occurance
            const new_sample_label = sample_label.substring(sample_label.lastIndexOf(box_join) + 1);
            // update sample label
            d['sample_label'] = new_sample_label; ////////// only generated with abnormal and integreted ////////////////////
            d['box_label'] = box_label; ////////// only generated with abnormal and integreted ////////////////////
            // d[( '' + (sample_header_col - 1) )] = new_sample_label;
            // validate box_label
            if (box_label !== null && box_label !== '' && box_label !== undefined
              && (d['invalid'] === undefined || d['invalid'] === false) ) {
              if (this.abnormal_boxes_to_create.indexOf(box_label.replace(/\s/g, '').toLowerCase()) === -1 ) {
                this.abnormal_boxes_to_create.push(box_label.replace(/\s/g, '').toLowerCase()); // no repeats
              }
            } else {
              d['invalid'] = true;
              // add row to remove
              this.updateRowToRemove4BoxLabelValidation(i);
            }
          } else {
            d['invalid'] = true;
            // add row to remove
            this.updateRowToRemove4BoxLabelValidation(i);
          }
        }
      } else {
        // sample label is with increasing number
        if ( this.sLabel.boxLabel === 1 && (box_join === '' || box_join === null)) {
          // cannot be seperated
          d['invalid'] = true;
          // add row to remove
          this.updateRowToRemove4BoxLabelValidation(i);
        } else {
          if (sample_label !== undefined && sample_label !== null && sample_label.lastIndexOf(box_join) !== -1) {
            let box_label = sample_label.substring(0, sample_label.lastIndexOf(box_join)); // only accept last occurance
            let new_sample_label = sample_label.substring(sample_label.lastIndexOf(box_join) + 1);
            if ( box_join === '') {
              // box label is only letters
              box_label = sample_label;
              box_label = box_label.replace(/[0-9]/g, ''); // remove all the numbers
              new_sample_label = sample_label;
              new_sample_label = new_sample_label.replace(/[a-zA-Z]/g, '');
              // sample label is only number
            } else {
              box_label = sample_label.substring(0, sample_label.lastIndexOf(box_join)); // only accept last occurance
              const s_array  = sample_label.split(box_join);
              new_sample_label = s_array[s_array.length - 1]; // last item
            }
            // update sample label
            d['sample_label'] = new_sample_label; ////////// only generated with abnormal and integreted ////////////////////
            d['box_label'] = box_label; ////////// only generated with abnormal and integreted ////////////////////
            // d[( '' + (sample_header_col - 1) )] = new_sample_label;
            // validate box_label
            if (box_label !== null && box_label !== '' && (d['invalid'] === undefined || d['invalid'] === false)) {
              if (this.abnormal_boxes_to_create.indexOf(box_label.replace(/\s/g, '').toLowerCase()) === -1 ) {
                this.abnormal_boxes_to_create.push(box_label.replace(/\s/g, '').toLowerCase()); // no repeats
              }
            } else {
              d['invalid'] = true;
              // add row to remove
              this.updateRowToRemove4BoxLabelValidation(i);
            }
          } else {
            d['invalid'] = true;
            // add row to remove
            this.updateRowToRemove4BoxLabelValidation(i);
          }
        }
      }
    })
    // update tower, shelf and box attrs
    this.genAbnormalBoxLabelInfo(sample_header_col, this.container, false);
    return too_many_samples;
  }
  testBoxLabel1Col(trimed_box_label: string, bLabel: BoxLabel, container: Container): Array<number> {
    const array: Array<number> = [];
    // first split the label
    const lArray = trimed_box_label.split(bLabel.join);
    if (lArray.length === 3) {
      // tower
      const tower = this.convertBoxLabel2Number(lArray, 'tower', bLabel, container);
      // shelf
      const shelf = this.convertBoxLabel2Number(lArray, 'shelf', bLabel, container);
      // box
      const box = this.convertBoxLabel2Number(lArray, 'box', bLabel, container);
      if (tower != null && shelf != null && box != null) {
        array[0] = tower;
        array[1] = shelf;
        array[2] = box;
        return array;
      }
    }
    return [];
  }
  testBoxLabel3Col(lArray: Array<string>, bLabel: BoxLabel, container: Container): Array<number> {
    const array: Array<number> = [];
    // first split the label
    if (lArray.length === 3) {
      // tower
      const tower = this.convertBoxLabel2Number(lArray, 'tower', bLabel, container);
      // shelf
      const shelf = this.convertBoxLabel2Number(lArray, 'shelf', bLabel, container);
      // box
      const box = this.convertBoxLabel2Number(lArray, 'box', bLabel, container);
      if (tower != null && shelf != null && box != null) {
        array[0] = tower;
        array[1] = shelf;
        array[2] = box;
        return array;
      }
    } else {
      return [];
    }
    return [];
  }
  // test whether tower, shelf and box is valid > max allowed number
  testTowerShelfBox(label_array: Array<number>, index: number): boolean {
    const type_array = ['tower', 'shelf', 'box'];
    label_array.forEach((t, i) => {
      if ( label_array[i] > this.container[type_array[i]]) {
        const message = type_array[i] + ' position in the box label for row ' + index + ' is invalid, this sample will be ignored!';
        this.emitValidationOutput(this.VALIDATION_BOX_LABEL, 1, message);
        return false; // invalid
      }
    });
    return true; // valid;
  }
  convertBoxLabel2Number (lArray: Array<string>, type: string, bLabel: BoxLabel, container: Container): number {
    const type_array = ['tower', 'shelf', 'box'];
    const type_index = type_array.indexOf(type.toLowerCase());
    if (type_index === -1) {
      return null;
    }
    const trimed = lArray[type_index].replace(/\s/g, '');
    if (bLabel[type] === 1) {
      //  is digits
      if (!isNaN(+trimed) && Number.isInteger(+trimed) && +trimed <= container[type] ) {
        return +lArray[type_index];
      }
    } else {
      //  is letters
      // test only word
      if (/^[a-zA-Z]+$/.test(trimed)) {
        // onvert letters to  digits
        const result = this.utilityService.convertLetters2Integer(trimed);
        if (result >= 0 && result <= container[type]) {
          return result;
        }
      }
    }
    return null;
  }
  getContainerTotalBoxes(container: Container) {
    return container.tower * container.shelf * container.box;
  }
  updateRowToRemove4BoxLabelValidation(index: number) {
    if (this.row_indexes_to_remove.indexOf(index) === -1) {
      this.row_indexes_to_remove.push(index);
      // emit message
      const message = 'box label for row ' + (index + 1 + this.col_offset) + ' is invalid, this sample will be ignored!';
      this.emitValidationOutput(this.VALIDATION_BOX_LABEL, 1, message);
    }
  }
  updateRowToRemove4SampleNameValidation(index: number) {
    if (this.row_indexes_to_remove.indexOf(index) === -1) {
      this.row_indexes_to_remove.push(index);
      // emit message
      const message = 'sample name for row ' + (index + 1 + this.col_offset) + ' is invalid, this sample will be ignored!';
      this.emitValidationOutput(this.VALIDATION_SAMPLE_NAME, 1, message);
    }
  }
  updateRowToRemove4SampleLabelValidation(index: number) {
    if (this.row_indexes_to_remove.indexOf(index) === -1) {
      this.row_indexes_to_remove.push(index);
      // emit message
      const message = 'sample label for row ' + (index + 1 + this.col_offset) + ' is invalid, this sample will be ignored!';
      this.emitValidationOutput(this.VALIDATION_SAMPLE_LABEL, 1, message);
    }
  }
  // remove the repeats in the array of this.boxes_to_create
  removeRepeatedBoxes(boxes_to_create: Array<Array<number>>) {
    const array: Array<Array<number>> = [];
    boxes_to_create.forEach((b: Array<number>) => {
      const found_boxes = array.filter( (a: Array<number>) => {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
      });
      if (found_boxes.length === 0) {
        array.push(b);
      };
    });
    return array;
  }
  // generate box info in the data array for abnormal box labels
  genAbnormalBoxLabelInfo(header_col: number, container: Container, separated: boolean) {
    // only when there are boxes to create
    if (this.abnormal_boxes_to_create.length > 0) {
      // this.abnormal_boxes_to_create.sort();
      let new_abnormal_boxes_to_create: Array<any> = [];
      let abnormal_boxes_to_remove: Array<any> = [];
      // get max boxes in the container
      const max_boxes_of_conatiner = this.getContainerTotalBoxes(this.container);
      // create only allowed boxes
      if (this.abnormal_boxes_to_create.length > max_boxes_of_conatiner ) {
        new_abnormal_boxes_to_create = this.abnormal_boxes_to_create.slice(0, max_boxes_of_conatiner);
        // the rest will be marked as invalida = true;
        abnormal_boxes_to_remove = this.abnormal_boxes_to_create.slice(max_boxes_of_conatiner);
      } else {
        new_abnormal_boxes_to_create = [...this.abnormal_boxes_to_create];
      }
      // filter the data array
      ////////////// UNCOMENT THIS AFTER FINISH ///////////////////
      // this.data = this.filterValidSamples(this.data);
      // appliy invalid == true
      this.data.forEach( (d, i) => {
        if (separated) {
          const box_label = '' + d[( '' + (header_col - 1) )];
          if (box_label === undefined || box_label === '' || box_label === null
          || abnormal_boxes_to_remove.indexOf(box_label.toLowerCase()) !== -1) {
            d['invalid'] = true;
            // add row to remove
            this.updateRowToRemove4BoxLabelValidation(i);
          }
        } else {
          // integreted
          if (d['box_label'] === undefined || abnormal_boxes_to_remove.indexOf(d['box_label'].toLowerCase()) !== -1) {
            d['invalid'] = true;
            // add row to remove
            this.updateRowToRemove4BoxLabelValidation(i);
          }
        }
      });
      // filter the samples again
      ////////////// UNCOMENT THIS AFTER FINISH ///////////////////
      // this.data = this.filterValidSamples(this.data);
      // generate all possible boxes in a container
      const all_containerboxes: Array<Array<number>> = this.genAllBoxesInContainer(this.container);
      new_abnormal_boxes_to_create.forEach( (b, i) => {
        // label
        const blabel = b;
        // get the box array
        const box_label_array = all_containerboxes[i];
        // apply tower, shelf and box
        this.data.forEach( (d, index) => {
          let box_label = '' + d[( '' + (header_col - 1) )]; // default
          if (separated) {
            box_label = '' + d[( '' + (header_col - 1) )];
          } else {
            // integreted
            box_label = d['box_label'];
          }
          if (box_label !== undefined && box_label !== '' && box_label !== null && box_label.replace(/\s/g, '').toLowerCase() === blabel
            && (d['invalid'] === undefined || d['invalid'] === false) ) {
            d['tower'] = box_label_array[0];
            d['shelf'] = box_label_array[1];
            d['box'] = box_label_array[2];
            // d['invalid'] = false;
          }
        });
      });
    }
  }
  validSampleLabel1Col(): boolean {
    let has_warning = false;
    // SampleLabel
    const sample_label_col = this.getColumnByHeader(this.SAMPLEPOSITION);
    // get the max sample in a box
    const max_sample_count = this.getMaxSamplePerBox();
    this.data.forEach((d, i) => {
      const sample_label = '' + d[( '' + (sample_label_col - 1) )];
      let invalid = false;
      let row_valid = false;
      let col_valid = false;
      if (sample_label === '' || sample_label === null || sample_label === undefined) {
        d['invalid'] = true;
        has_warning = true;
        this.updateRowToRemove4SampleLabelValidation(i);
        invalid = true;
      } else {
        // sample join
        const sample_join = this.sLabel.sampleJoin;
        if (sample_label !== '' && sample_label !== null && sample_label.indexOf(sample_join) === -1) {
          d['invalid'] = true;
          has_warning = true;
          this.updateRowToRemove4SampleLabelValidation(i);
          invalid = true;
        } else {
          // this.utilityService.convertLetters2Integer(this.sLabel.box_vertical)
          // split sample label
          const sArray = sample_label.split(sample_join);
          const sample_row = sArray[0]; // need save as number // box_horizontal
          const sample_col = sArray[1]; // need to save as letter
          if (this.sLabel.sampleRow === 0 ) {
            // letters
            if ( (/^[a-zA-Z]+$/.test(sample_row))
                && (+this.sLabel.box_horizontal >= this.utilityService.convertLetters2Integer(sample_row)) ) {
              invalid = false;
              row_valid = true;
            } else {
              invalid = true;
            }
          } else {
            // 1, number
            if ( (/^[0-9]+$/.test(sample_row)) && +this.sLabel.box_horizontal >= +sample_row && +sample_row > 0) {
                invalid = false;
                row_valid = true;
            } else {
              invalid = true;
            }
          }
          if (this.sLabel.sampleColumn === 0 ) {
            // letters
            if ((/^[a-zA-Z]+$/.test(sample_col))
                && (this.utilityService.convertLetters2Integer(this.sLabel.box_vertical) >=
                this.utilityService.convertLetters2Integer(sample_col))) {
                  invalid = false;
                  col_valid = true;
            } else {
              invalid = true;
            }
          } else {
            // 1, number
            if ( (/^[0-9]+$/.test(sample_col))
            && (this.utilityService.convertLetters2Integer(this.sLabel.box_vertical) >= +sample_col) && +sample_col > 0) {
              invalid = false;
              col_valid = true;
            } else {
              invalid = true;
            }
          }
          // sum
          if (invalid || !col_valid || !row_valid) {
            d['invalid'] = true;
            has_warning = true;
            this.updateRowToRemove4SampleLabelValidation(i);
          } else {
            // d['invalid'] = false;
            // number
            d['hposition'] = this.sLabel.sampleRow === 0 ? this.utilityService.convertLetters2Integer(sample_row) : +sample_row;
            // letter
            d['vposition'] = this.sLabel.sampleColumn === 0 ? sample_col : this.utilityService.convertInteger2Letter(+sample_col)
          }
        }
      }
    });
    return has_warning;
  }
  validSampleLabel2Col(): boolean {
    let has_warning = false;
    // SamplePosition_Row and SamplePosition_Column
    const sample_label_row = this.getColumnByHeader(this.SAMPLEPOSITION + '_Row');
    const sample_label_col = this.getColumnByHeader(this.SAMPLEPOSITION + '_Column');
    // get the max sample in a box
    const max_sample_count = this.getMaxSamplePerBox();
    this.data.forEach((d , i) => {
      let invalid = false;
      let row_valid = false;
      let col_valid = false;
      const sample_row = '' + d[( '' + (sample_label_row - 1) )];
      const sample_col = '' + d[( '' + (sample_label_col - 1) )];
      if (sample_row === '' || sample_row === null || sample_row === undefined
          || sample_col === '' || sample_col === null || sample_col === undefined) {
        invalid = true;
      } else {
        if (this.sLabel.sampleRow === 0 ) {
          // letters
          if ( (/^[a-zA-Z]+$/.test(sample_row))
              && (+this.sLabel.box_horizontal >= this.utilityService.convertLetters2Integer(sample_row)) ) {
            invalid = false;
            row_valid = true;
          } else {
            invalid = true;
          }
        } else {
          // 1, number
          if ( (/^[0-9]+$/.test(sample_row)) && +this.sLabel.box_horizontal >= +sample_row && +sample_row > 0 ) {
              invalid = false;
              row_valid = true;
          } else {
            invalid = true;
          }
        }
        if (this.sLabel.sampleColumn === 0 ) {
          // letters
          if ((/^[a-zA-Z]+$/.test(sample_col))
              && (this.utilityService.convertLetters2Integer(this.sLabel.box_vertical) >=
              this.utilityService.convertLetters2Integer(sample_col))) {
                invalid = false;
                col_valid = true;
          } else {
            invalid = true;
          }
        } else {
          // 1, number
          if ( (/^[0-9]+$/.test(sample_col))
          && (this.utilityService.convertLetters2Integer(this.sLabel.box_vertical) >= +sample_col) && +sample_col > 0) {
            invalid = false;
            col_valid = true;
          } else {
            invalid = true;
          }
        }
      }
      // sum
      if (invalid || !col_valid || !row_valid) {
        d['invalid'] = true;
        has_warning = true;
        this.updateRowToRemove4SampleLabelValidation(i);
      } else {
        // d['invalid'] = false;
        // number
        d['hposition'] = this.sLabel.sampleRow === 0 ? this.utilityService.convertLetters2Integer(sample_row) : +sample_row;
        // letter
        d['vposition'] = this.sLabel.sampleColumn === 0 ? sample_col : this.utilityService.convertInteger2Letter(+sample_col)
      }
    });
    return has_warning;
  }
  validSampleLabelIncreasingNumber(has_box_label: boolean): boolean {
    let has_warning = false;
    // get the max sample in a box
    const max_sample_count = this.getMaxSamplePerBox();
    // get total number of samples of the container
    const total_samples_of_container = this.getContainerCapacity(this.sLabel, this.container);
    const max_boxes_of_conatiner = this.getContainerTotalBoxes(this.container);
    const all_containerboxes: Array<Array<number>> = this.genAllBoxesInContainer(this.container);
    // SampleLabel
    if (!has_box_label) {
      // no box label
      const sample_label_col = this.getColumnByHeader(this.SAMPLEPOSITION);
      this.data.forEach((d, i) => {
        const sample_label = '' + d[( '' + (sample_label_col - 1) )];
        if (sample_label !== undefined && (/^[0-9]+$/.test(sample_label))
            && +sample_label <= total_samples_of_container && +sample_label > 0
            && (d['invalid'] === undefined || d['invalid'] === false)) {
          d = this.updateDForIncreaingNumberWithoutBoxLabel(sample_label, d, max_sample_count, all_containerboxes);
        } else {
          d['invalid'] = true;
          has_warning = true;
          this.updateRowToRemove4SampleLabelValidation(i);
        }
      });
    } else {
      // has box label
      if ( !this.bLabel.box_defined_as_normal && !this.bLabel.box_sample_separated) {
        // already has sample_label attr
        this.data.forEach((d, i) => {
          const sample_label = d['sample_label'];
          const box_label = d['box_label'];
          if ( (/^[0-9]+$/.test(sample_label)) && +sample_label <= total_samples_of_container && +sample_label > 0
          && box_label !== undefined && box_label !== null && box_label !== ''
          && this.abnormal_boxes_to_create.indexOf(box_label.replace(/\s/g, '').toLowerCase()) !== -1
          && (d['invalid'] === undefined || d['invalid'] === false)
          ) {
            d = this.updateDForIncreaingNumberWithBoxLabel(sample_label, d, max_sample_count);
          } else {
            d['invalid'] = true;
            has_warning = true;
            this.updateRowToRemove4SampleLabelValidation(i);
          }
        });
      } else {
        if (this.bLabel.box_defined_as_normal) {
          // normal box label
          const sample_label_col = this.getColumnByHeader(this.SAMPLEPOSITION);
          this.data.forEach((d, i) => {
            const sample_label = '' + d[( '' + (sample_label_col - 1) )]; // should be in the range of [1, max_sample_count]
            if (sample_label !== undefined && (/^[0-9]+$/.test(sample_label))
            && +sample_label <= total_samples_of_container && +sample_label > 0
            && (d['invalid'] === undefined || d['invalid'] === false) ) {
              d = this.updateDForIncreaingNumberWithBoxLabel(sample_label, d, max_sample_count);
            } else {
              d['invalid'] = true;
              has_warning = true;
              this.updateRowToRemove4SampleLabelValidation(i);
            }
          });
        } else {
          // abnormal but seperated
          // no sample_label attr yet
          const sample_label_col = this.getColumnByHeader(this.SAMPLEPOSITION);
          const box_label_col = this.getColumnByHeader(this.BOXPOSITION);
          this.data.forEach((d, i) => {
            const sample_label = '' + d[( '' + (sample_label_col - 1) )]; // should be in the range of [1, max_sample_count]
            const box_label = d[('' + (box_label_col - 1))];
            if (sample_label !== undefined && (/^[0-9]+$/.test(sample_label))
                && +sample_label <= total_samples_of_container && +sample_label > 0
                && box_label !== undefined && box_label !== null && box_label !== ''
                && this.abnormal_boxes_to_create.indexOf(box_label.replace(/\s/g, '').toLowerCase()) !== -1
                && (d['invalid'] === undefined || d['invalid'] === false)) {
              d = this.updateDForIncreaingNumberWithBoxLabel(sample_label, d, max_sample_count);
            } else {
              d['invalid'] = true;
              has_warning = true;
              this.updateRowToRemove4SampleLabelValidation(i);
            }
          });
        }
      }
    }
    return has_warning;
  }
  // generate all the possible boxes in a container
  genAllBoxesInContainer(container: Container): Array<Array<number>> {
    const bArray: Array<Array<number>> = [];
    // tower
    for (let t = 0; t < container.tower; t++) {
      // shelf
      for (let s = 0; s < container.tower; s++) {
        // box
        for (let b = 0; b < container.box; b++) {
          const array = []
          array[0] = t + 1; array[1] = s + 1; array[2] = b + 1;
          bArray.push(array);
        }
      }
    }
    return bArray;
  }
  getMaxSamplePerBox(): number {
    return this.utilityService.convertLetters2Integer(this.sLabel.box_vertical) * this.sLabel.box_horizontal
  }
  getContainerCapacity(sLabel: SampleLabel, container: Container) {
    const total_boxes = container.tower * container.shelf * container.box;
    const max_sample_per_box = this.utilityService.convertLetters2Integer(sLabel.box_vertical) * sLabel.box_horizontal;
    return total_boxes * max_sample_per_box;
  }
  checkValidationOutcome(output: number, type: string) {
    let message = '';
    if (output  === 0) {
      message = 'validate ' + type + ' passed';
      this.emitValidationOutput(this.VALIDAITON_CHECKING, 0, message);
    } else if (output  === 1) {
      message = 'validate ' + type + ' passed with warning, samples with invalid ' + type + ' will be ignored!';
      this.emitValidationOutput(this.VALIDAITON_CHECKING, 1, message);
    } else {
      message = 'validate ' + type + ' failed, please fix ' + type + ' before proceeding further!';
      this.emitValidationOutput(this.VALIDAITON_CHECKING, 2, message);
      this.validator_failed = true;
    }
  }
  validateDataLength(initial: boolean) {
    if (!this.validator_failed && (this.data === undefined  || this.data.length === 0)) {
      const message = initial
      ?
      'no sample to validate, please make sure the file uploaded is not empty!' :
      'no valid sample left, validation stopped!';
      this.emitValidationOutput(this.VALIDATION_SAMPLE_COUNT, 2, message);
      this.validator_failed = true;
    } else {
      const message =  initial
      ? 'total number of samples is: ' + this.data.length + '.'
      : 'total number of samples left is: ' + this.data.length + '.';
      this.emitValidationOutput(this.VALIDATION_SAMPLE_COUNT, 3, message);
    }
  }
  passAllValidation () {
    if (!this.validator_failed) {
      this.validation_finished = true;
      this.valiadtionStep$.next('all validations passed!');
      // emit messages
      const message = 'all validations passed! You may want to check the possible warning outputs';
      this.emitValidationOutput(this.VALIDAITON_CHECKING, 0, message);
    }
  }
  // scrool to bottom
  scrollToBottom(): void {
    try {
        this.messageBox.nativeElement.scrollTop = this.messageBox.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }
  // scrool to bottom
  // ngAfterViewChecked() {
  //   this.scrollToBottom();
  // }
  updateDForIncreaingNumberWithoutBoxLabel(sample_label: string, d: Array<any>, max_sample_count: number,
                            all_containerboxes: Array<Array<number>>): Array<any> {
    // d['invalid'] = false;
    // gen the box label and v/h positions
    // box position
    const b_index = Math.floor ( +sample_label / max_sample_count );
    const b_index_remainder = +sample_label % max_sample_count;
    let box_position: Array<number> = [];
    if (b_index === 0 && b_index_remainder === 0) {
      box_position = all_containerboxes[0];
    } else if (b_index === 0 && b_index_remainder > 0) {
      // first box
      box_position = all_containerboxes[0];
    } else if (b_index > 0 && b_index_remainder === 0) {
      box_position = all_containerboxes[ b_index - 1 ];
    } else {
      box_position = all_containerboxes[ b_index ];
    }
    d['tower'] = box_position[0];
    d['shelf'] = box_position[1];
    d['box'] = box_position[2];
    // sample position in the box
    const s_index = +sample_label % max_sample_count;
    // get v/h positions
    const s_vposition_index = Math.floor (s_index / this.sLabel.box_horizontal );
    const s_hposiiton_index = s_index % this.sLabel.box_horizontal;
    if (s_vposition_index === 0 && s_hposiiton_index === 0) {
      d['vposition'] = 'A';
      d['hposition'] = 1;
    } else if (s_vposition_index === 0 && s_hposiiton_index > 0) {
      // first row
      d['vposition'] = this.utilityService.convertInteger2Letter (1);
      d['hposition'] = s_hposiiton_index;
    } else if (s_vposition_index > 0 && s_hposiiton_index === 0) {
      // first row
      d['vposition'] = this.utilityService.convertInteger2Letter (s_vposition_index);
      d['hposition'] = this.sLabel.box_horizontal;
    } else {
      d['vposition'] = this.utilityService.convertInteger2Letter (s_vposition_index + 1);
      d['hposition'] = s_hposiiton_index
    }
    return d;
  }
  updateDForIncreaingNumberWithBoxLabel(sample_label: string, d: Array<any>, max_sample_count: number): Array<any> {
    // get v/h positions
    const s_vposition_index = Math.floor (+sample_label / this.sLabel.box_horizontal );
    const s_hposiiton_index = +sample_label % this.sLabel.box_horizontal;
    // get v/h positions
    if (s_vposition_index === 0 && s_hposiiton_index === 0) {
      d['vposition'] = 'A';
      d['hposition'] = 1;
    } else if (s_vposition_index === 0 && s_hposiiton_index > 0) {
      // first row
      d['vposition'] = this.utilityService.convertInteger2Letter (1);
      d['hposition'] = s_hposiiton_index;
    } else if (s_vposition_index > 0 && s_hposiiton_index === 0) {
      // first row
      d['vposition'] = this.utilityService.convertInteger2Letter (s_vposition_index);
      d['hposition'] = this.sLabel.box_horizontal;
    } else {
      d['vposition'] = this.utilityService.convertInteger2Letter (s_vposition_index + 1);
      d['hposition'] = s_hposiiton_index;
    }
    return d;
  }
  collectBoxes2Create() {
    const final_boxes_to_create: Array<Array<number>> = [];
    this.data.forEach((d, i) => {
      const box_to_create: Array<number> = [];
      box_to_create[0] = d['tower'];
      box_to_create[1] = d['shelf'];
      box_to_create[2] = d['box'];
      const matched_boxes = final_boxes_to_create.filter((b, bi) => {
        return b[0] === box_to_create[0] && b[1] === box_to_create[1] && b[2] === box_to_create[2]
      })
      if (matched_boxes.length === 0) {
        final_boxes_to_create.push(box_to_create);
      }
    });
    return final_boxes_to_create;
  }
  validateFinalBoxes2Create() {
    if (this.final_boxes_to_create.length === 0) {
      const message = 'no boxes to create, validation stopped!';
      this.emitValidationOutput(this.VALIDAITON_BOXES_TO_CREATE_CHECKING, 2, message);
      this.validator_failed = true;
    } else {
      const message = 'total number of boxes to create: ' + this.final_boxes_to_create.length + '!';
      this.emitValidationOutput(this.VALIDAITON_BOXES_TO_CREATE_CHECKING, 0, message);
    }
  }
  format4Saving() {
    this.data.forEach(d => {
      d['type'] = this.sampleType;
      d['box_horizontal'] = this.sLabel.box_horizontal;
      d['box_vertical'] = this.utilityService.convertLetters2Integer(this.sLabel.box_vertical);
      for (let i = 0; i < d.length; i++) {
        if (d[ i + '' ] !== undefined ) {
          delete d[ i + '' ];
        }
      }
    })
  }
  getExcludedColumns4DataFormat() {
    const sampleExcelHeaders: Array<SampleExcelHeaders> = this.excelUploadLoadService.getAllExcelHeaders();
    let box_label_headers = [];
    if (this.bLabel.box_has_label) {
      box_label_headers = sampleExcelHeaders.filter(h => h.header_type === 'box_position')[0].headers;
    }
    const sample_label_headers = sampleExcelHeaders.filter(h => h.header_type === 'sample_position')[0].headers;
    return [...box_label_headers, ...sample_label_headers, 'Name', this.FREEZING_DATE];
  }
  saveSamples() {
    this.saving_samples = true;
    this.saving_samples_failed = false;
    // convert data
    const samples: Array<UploadSample> = this.convertData2Samples();
    this.containerService.uploadSample2Container(samples, this.container.pk)
    .subscribe(() => {
      this.saving_samples = false;
      this.saving_samples_failed = false;
      this.alertService.success('Your samples have been successfully uploaded!', true);
      this.router.navigate(['/containers']);
    },
    (e) => {
      console.log(e);
      this.saving_samples = false;
      this.saving_samples_failed = true;
      this.alertService.error('Failed to upload your samples!', true);
    });
  }
  save2Json() {
    // convert data
    const samples: Array<UploadSample> = this.convertData2Samples();
    this.xlsxHelperService.export2Json(samples);
  }
  // convert to samples
  convertData2Samples() {
    const samples: Array<UploadSample> = new Array<UploadSample>();
    // get all headers
    const allSampleModelAttrs: Array<string> = this.excelUploadLoadService.getAllSampleModelAttrs();
    const allAttrs: Array<string> = ['box_horizontal', 'box_vertical', 'tower', 'shelf', 'box', 'type',
                                    'freezing_date', 'vposition', 'hposition', ...allSampleModelAttrs];
    this.data.forEach(d => {
      const sample: UploadSample = new UploadSample();
      allAttrs.forEach(a => {
        if (d[a] !== undefined) {
          sample[a] = d[a];
        } else {
          sample[a] = null;
        }
      });
      // force the default freezing date
      if ( d['freezing_date'] === '' || d['freezing_date'] === null) {
        sample['freezing_date']  = this.utilityService.getTodayFormat();
      }
      samples.push(sample);
    })
    return samples;
  }
  // download for 2 checking
  format4Download(data: Array<Array<any>>) {
    let formated4Download: Array<Array<any>> = [];
    // get all the sample mode attrs
    const sampleModelAttrs: Array<string> = ['tower', 'shelf', 'box', 'vposition', 'hposition',
                                              ...this.excelUploadLoadService.getAllSampleModelAttrs() ];
    // get all col headers
    const all_col_headers: Array<string> = ['Tower', 'Shelf', 'Box', 'Sample Row', 'Sample Column',
                                            ...this.excelUploadLoadService.getAllColumnHeaders()];
    // get all the sample model attr in data
    const data_keys = this.getDataKeys(data[0], sampleModelAttrs); // this.data should be out put of this.formatData()
    const data_headers = this.getDataHeaders(data_keys, sampleModelAttrs, all_col_headers); // map to all headers
    // const data4download_headers = formated4Download.push();
    const data4download = [...data];
    data4download.forEach((d: Array<any>, di) => {
      data_keys.forEach((k, i) => {
        if (d[k] !== undefined) {
          d[i + ''] = d[k];
        } else {
          d[i + ''] = null;
        }
      })
    });
    formated4Download = [data_headers, ...data4download];
    return formated4Download;
  }
  getDataKeys(data_item: Array<any>, sampleModelAttrs: Array<string>) {
    const keys: Array<string> = [];
    sampleModelAttrs.forEach(a => {
      if (data_item[a] !== undefined) {
        keys.push(a);
      }
    });
    return keys;
  }
  getDataHeaders(data_keys: Array<string>, sampleModelAttrs: Array<string>,  all_col_headers: Array<string>) {
    const headers: Array<string> = [];
    data_keys.forEach((k, i) => {
      if (sampleModelAttrs.indexOf(k) !== -1 ) {
        headers[i + ''] = all_col_headers[sampleModelAttrs.indexOf(k)];
      } else {
        headers[i + ''] = null;
      }
    })
    return headers;
  }
  exportXlsx(): void {
    const data4download = this.format4Download([...this.data]);
    this.xlsxHelperService.exportXlsx(data4download, this.worksheet_name, this.fileName);
    this.double_checked = true;
    this.alertService.success('Please open the downloaded excel file to double-check what will be uploaded!', true);
  }
}
