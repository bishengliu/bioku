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
      // console.log(this.bLabel);
      // console.log(this.sLabel);
      // console.log(this.freezingDateFormat);
      // console.log(this.excelColAttrs);
      console.log(this.excelData);
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
    this.valiadtionStep$.next(this.getValidationStep(this.sampleValidator.validator_pointer));

    const msg1: ValidatorOutput = new ValidatorOutput();
    msg1.validation_step = 0;
    // box_defined_as_normal
    msg1.status = 3;
    msg1.message = this.bLabel.box_defined_as_normal
      ? 'your boxes are labeled following the pattern of "TOWER-SHELF-BOX"'
      : 'your boxes are labeled NOT following the pattern of "TOWER-SHELF-BOX"';
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
        // format box label
        const msg6: ValidatorOutput = new ValidatorOutput();
        msg6.validation_step = 0;
        msg6.status = 3;
        msg6.message = 'validate box labels (column ' + this.getColumnByHeader('BoxLabel') + ') ...';
        this.valdatorOutput$.next(msg6);
        const box_label_validation_output = this.parseBoxLabel();
        if (box_label_validation_output  === 0) {
          const msg: ValidatorOutput = new ValidatorOutput();
          msg.validation_step = 0;
          msg.status = 0;
          msg.message = 'validate box labels (column ' + this.getColumnByHeader('BoxLabel') + ') passed';
          this.valdatorOutput$.next(msg);
        } else if (box_label_validation_output  === 1) {
          const msg: ValidatorOutput = new ValidatorOutput();
          msg.validation_step = 0;
          msg.status = 1;
          msg.message = 'validate box labels (column ' + this.getColumnByHeader('BoxLabel') + ') passed with warning';
          this.valdatorOutput$.next(msg);
        } else {
          const msg: ValidatorOutput = new ValidatorOutput();
          msg.validation_step = 0;
          msg.status = 2;
          msg.message = 'validate box labels (column ' + this.getColumnByHeader('BoxLabel') + ') failed';
          this.valdatorOutput$.next(msg);
          this.validator_failed = true;
        }
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
        msg5.message = 'your box labels are stored in 1 cloumn (column ' + this.getColumnByHeader('BoxLabel')
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

  validateSampleLabel() {}

  validateFreezingDateFormat() {}

  validateBoxCreation() {}

  validateSampleCreation() {}

  // general clean the data after alll validation
  formatData() {}

  validateServerSerializer() {}

  getColumnByHeader(header: string) {
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

  parseBoxLabel(): number {
    let output = 2;
    if (this.bLabel.box_defined_as_normal) {
      // definition for tow, shefl and box
      if (this.bLabel.box_tsb_one_column) {
        // 1 col
        const box_label_header = this.getColumnByHeader('BoxLabel');
        console.log(box_label_header);
        // format data and test
        this.excelData.forEach( (d: Array<any>) => {
          console.log(d[( '' + (box_label_header - 1) )]);
        })
      } else {
        // 3 cols
        const box_label_tower = this.getColumnByHeader('BoxLabel_Tower');
        const box_label_shelf = this.getColumnByHeader('BoxLabel_Shelf');
        const box_label_box = this.getColumnByHeader('BoxLabel_Box');
        // format data and test
      }
    } else {
      // abnormal
      if (this.bLabel.box_sample_separated) {
        // seperated with sample
      } else {
        // with sample label
      }
    }
    return output;
  }
}
