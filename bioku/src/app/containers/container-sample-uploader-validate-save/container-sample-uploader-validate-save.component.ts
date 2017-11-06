import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BoxLabel, SampleLabel, ColumnAttr, SampleFile, SampleExcelHeaders, SampleDateFormat,
  SampleValidator, ValidatorOutput } from '../../_classes/sampleUpload';
  import { Observable, BehaviorSubject, Subject } from 'rxjs';
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
  validator_under_going: Boolean = true;
  saving_sample_posting_validation: Boolean = false;
  validator_failed: Boolean = false;
  sampleValidator: SampleValidator = new SampleValidator();

  validation_step = 'validation started ...';
  // step subject
  valiadtionStep$: Subject<string> = new Subject<string>();
  // validator output subject
  valdatorOutput$: Subject<ValidatorOutput> = new Subject<ValidatorOutput>();

  constructor() {
    this.sampleValidator.validation_steps = ['valiating box labels ...'];
    this.sampleValidator.validation_steps_icons = ['grid layout'];
    this.sampleValidator.validator_pointer = 0;
    this.sampleValidator.validation_status = true;
    this.sampleValidator.validator_outputs = new Array<ValidatorOutput>();
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
      }, () => {});
   }

  ngOnInit() {

  }
  ngOnChanges() {
    if (this.startValidation) {
      console.log('start validaiton ...');
      // start validation
      // console.log(this.bLabel);
      // console.log(this.sLabel);
      // console.log(this.freezingDateFormat);
      // console.log(this.excelColAttrs);
      // console.log(this.excelData);
      this.sampleValidation();
    }
  }

  sampleValidation () {
    // step one check box label
    this.validateBoxLabel();
  }

  validateBoxLabel() {
    // set pointer
    this.sampleValidator.validator_pointer = 0;
    // emit step
    this.valiadtionStep$.next(this.getValidationStep());

    const msg1: ValidatorOutput = new ValidatorOutput();
    msg1.validation_step = 0;
    // box_defined_as_normal
    msg1.status = 3;
    msg1.message = this.bLabel.box_defined_as_normal
      ? 'your boxes are labeled following the pattern of TOWER-SHELF-BOX'
      : 'your boxes are labeled NOT following the pattern of TOWER-SHELF-BOX';
    this.valdatorOutput$.next(msg1);
    // if normal
    if (this.bLabel.box_defined_as_normal) {
      if (this.bLabel.box_tsb_one_column) {
        // one cloumn
        const msg2: ValidatorOutput = new ValidatorOutput();
        msg2.validation_step = 0;
        msg2.status = 3;
        msg2.message = 'your box labels are stored in one cloumn (column ' + this.getColumnByHeader('BoxLabel') + ')';
        this.valdatorOutput$.next(msg2);
        // validate the boxlabel
      } else {
        // 3 columns
        const msg3: ValidatorOutput = new ValidatorOutput();
        msg3.validation_step = 0;
        msg3.status = 3;
        msg3.message = 'your box labels are stored in 3 cloumns (tower in column ' + this.getColumnByHeader('BoxLabel_Tower') + ', '
        + 'shelf in column ' + this.getColumnByHeader('BoxLabel_Shelf') + ', '
        + 'box in column ' + this.getColumnByHeader('BoxLabel_Box') + ')';
        this.valdatorOutput$.next(msg3);
        // validate the boxlabel
      }
    } else {

      // box defined abnormal
      if (this.bLabel.box_sample_separated) {
        // box label is seperated
        const msg5: ValidatorOutput = new ValidatorOutput();
        msg5.validation_step = 0;
        msg5.status = 3;
        msg5.message = 'your box labels are stored in 1 cloumn (column ' + this.getColumnByHeader('BoxLabel_Tower')
        + ') and seperated from sample labels';
      } else {
        // box label together with sample label
        const msg5: ValidatorOutput = new ValidatorOutput();
        msg5.validation_step = 0;
        msg5.status = 3;
        msg5.message = 'your box labels are stored in 1 cloumn (column ' + this.getColumnByHeader('SampleLabel')
        + ') and integrated with sample labels';
      }
    }
  }

  getColumnByHeader(header: string) {
    const cols = this.excelColAttrs.filter(attr => attr.col_header === header);
    if (cols.length > 0) {
      return cols[0].col_number;
    } else {
      return -1;
    }
  }

  getValidationStep(): string {
    return this.sampleValidator.validation_steps[this.sampleValidator.validator_pointer];
  }
}
