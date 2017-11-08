import { Component, Inject, OnInit, Input, OnChanges, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { BoxLabel, SampleLabel, ColumnAttr, SampleFile, SampleExcelHeaders, SampleDateFormat,
  SampleValidator, ValidatorOutput } from '../../_classes/sampleUpload';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';
import { Container } from '../../_classes/Container';
import { Box } from '../../_classes/Box';
import { UtilityService } from '../../_services/UtilityService';
@Component({
  selector: 'app-container-sample-uploader-validate-save',
  templateUrl: './container-sample-uploader-validate-save.component.html',
  styleUrls: ['./container-sample-uploader-validate-save.component.css']
})
export class ContainerSampleUploaderValidateSaveComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() sLabel: SampleLabel;
  @Input() bLabel: BoxLabel;
  @Input() excelData: Array<Array<any>>;
  @Input() excelColAttrs: Array<ColumnAttr>;
  @Input() freezingDateFormat: SampleDateFormat;
  @Input() startValidation: Boolean;
  container: Container;
  row_indexes_to_remove: Array<number> = []; // rows that failed the vlidation
  boxes_to_create: Array<Array<number>> = [];
  validator_under_going: Boolean = true;
  saving_sample_posting_validation: Boolean = false;
  validator_failed: Boolean = false;
  sampleValidator: SampleValidator = new SampleValidator();
  data: Array<Array<any>>; // for keep the origin nal copy
  validation_step = 'validator initiated ...';
  // step subject
  valiadtionStep$: Subject<string> = new Subject<string>();
  // validator output subject
  valdatorOutput$: Subject<ValidatorOutput> = new Subject<ValidatorOutput>();
  // implement auto scroll to bottom
  @ViewChild('messageBox') private messageBox: ElementRef;
  constructor(@Inject(AppStore) private appStore, private utilityService: UtilityService, ) {
    // subscribe store state changes
    appStore.subscribe(() => this.updateState());
    this.updateState();
    this.sampleValidator.validation_steps = ['validating box labels ...'];
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
        // this.scrollToBottom();
      }, () => {});
   }

  ngOnInit() { }
  updateState() {
    const state = this.appStore.getState();
    if (state.containerInfo && state.containerInfo.currentContainer) {
      this.container = state.containerInfo.currentContainer;
    }
  }
  ngOnChanges() {
    if (this.startValidation) {
      // console.log(this.bLabel);
      // console.log(this.sLabel);
      // console.log(this.freezingDateFormat);
      // console.log(this.excelColAttrs);
      // console.log(this.excelData);
      this.data = this.excelData;
      this.sampleValidation();
    }
  }

  sampleValidation () {
    // step one check box label
    this.validateBoxLabel();
    console.log(this.data);
  }

  validateBoxLabel() {
    // set pointer
    this.sampleValidator.validator_pointer = 0;
    // emit step
    this.valiadtionStep$.next(this.getValidationStep(this.sampleValidator.validator_pointer));
    // emit messages
    let message = this.bLabel.box_defined_as_normal
      ? 'your boxes are labeled following the pattern of "TOWER-SHELF-BOX"'
      : 'your boxes are labeled NOT following the pattern of "TOWER-SHELF-BOX"';
    this.emitValidationOutput(0, 3, message);
    // emit messages
    if (this.bLabel.box_defined_as_normal) {
      if (this.bLabel.box_tsb_one_column) {
        // one cloumn
        message = 'your box labels are stored in one cloumn (column ' + this.getColumnByHeader('BoxLabel') + ')';
        this.emitValidationOutput(0, 3, message);
        // validate the boxlabel
        // format box label
        message = 'validate box labels (column ' + this.getColumnByHeader('BoxLabel') + ') ...';
        this.emitValidationOutput(0, 3, message);
      } else {
        // 3 columns
        message = 'your box labels are stored in 3 cloumns (tower in column ' + this.getColumnByHeader('BoxLabel_Tower') + ', '
        + 'shelf in column ' + this.getColumnByHeader('BoxLabel_Shelf') + ', '
        + 'box in column ' + this.getColumnByHeader('BoxLabel_Box') + ')';
        this.emitValidationOutput(0, 3, message);
      }
    } else {
      // box defined abnormal
      if (this.bLabel.box_sample_separated) {
        // box label is seperated
        message = 'your box labels are stored in 1 cloumn (column ' + this.getColumnByHeader('BoxLabel')
        + ') and seperated from sample labels';
        this.emitValidationOutput(0, 3, message);
      } else {
        // box label together with sample label
        message = 'your box labels are stored in 1 cloumn (column ' + this.getColumnByHeader('SampleLabel')
        + ') and integrated with sample labels';
        this.emitValidationOutput(0, 3, message);
      }
    }
    // parse box labels
    const box_label_validation_output = this.parseBoxLabel();
    if (box_label_validation_output  === 0) {
      message = 'validate box labels passed';
      this.emitValidationOutput(0, 0, message);
    } else if (box_label_validation_output  === 1) {
      message = 'validate box labels passed with warning, samples with invalid box labels will be ignored!';
      this.emitValidationOutput(0, 1, message);
    } else {
      message = 'validate box labels failed, please fix box labels before proceeding further!';
      this.emitValidationOutput(0, 2, message);
      this.validator_failed = true;
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

  emitValidationOutput(validation_step: number, status: number, message: string) {
    const msg: ValidatorOutput = new ValidatorOutput();
    msg.validation_step = validation_step;
    msg.status = status;
    msg.message = message;
    this.valdatorOutput$.next(msg);
  }

  parseBoxLabel(): number {
    let output = 0;
    if (this.bLabel.box_defined_as_normal) {
      // definition for tow, shefl and box
      if (this.bLabel.box_tsb_one_column) {
        // 1 col
        const box_label_header = this.getColumnByHeader('BoxLabel');
        // format data and test
        this.data.forEach((d: Array<any>, i) => {
          let box_label = d[( '' + (box_label_header - 1) )];
          // get the box label patthern
          // trim the label;
          if (this.bLabel.prefix !== '' && this.bLabel.prefix != null
              && box_label.toLowerCase().startsWith(this.bLabel.prefix.toLowerCase())) {
                const prefix_index = box_label.toLowerCase().indexOf(this.bLabel.prefix.toLowerCase());
                d[( '' + (box_label_header - 1) )] = box_label.substring(prefix_index);
          }
          box_label = d[( '' + (box_label_header - 1) )];
          if (this.bLabel.appendix !== '' && this.bLabel.appendix != null
          && box_label.toLowerCase().endsWith(this.bLabel.appendix.toLowerCase())) {
            const appendix_index = box_label.toLowerCase().indexOf(this.bLabel.appendix.toLowerCase());
            d[( '' + (box_label_header - 1) )] = box_label.substring(0, appendix_index);
          }
          box_label = d[( '' + (box_label_header - 1) )];
          // test the label, retrun parsed box label array or null
          const label_array = this.testBoxLabel1Col(box_label, this.bLabel, this.container);
          if (label_array.length > 0) {
            d['tower'] = label_array[0];
            d['shelf'] = label_array[1];
            d['box'] = label_array[2];
            d['invalid'] = false;
            this.boxes_to_create.push(label_array); // need filter out the duplicates later on
          } else {
            d['invalid'] = true;
            if (this.row_indexes_to_remove.indexOf(i) === -1) {
              this.row_indexes_to_remove.push(i);
              output = 1;
              // emit message
              const message = 'box label for row ' + i + ' is invalid, this sample will be ignored!';
              this.emitValidationOutput(0, 1, message);
            }
          }
        })
      } else {
        // 3 cols
        const box_label_tower = this.getColumnByHeader('BoxLabel_Tower');
        const box_label_shelf = this.getColumnByHeader('BoxLabel_Shelf');
        const box_label_box = this.getColumnByHeader('BoxLabel_Box');
        this.data.forEach( (d: Array<any>, i) => {
          const lArray: Array<string> = [ d[( '' + (box_label_tower - 1) )],
            d[( '' + (box_label_shelf - 1) )], d[( '' + (box_label_box - 1) )]];
            const label_array = this.testBoxLabel3Col(lArray, this.bLabel, this.container);
            if (label_array.length > 0) {
              d['tower'] = label_array[0];
              d['shelf'] = label_array[1];
              d['box'] = label_array[2];
              d['invalid'] = false;
              this.boxes_to_create.push(label_array); // need filter out the duplicates later on
            } else {
              d['invalid'] = true;
              if (this.row_indexes_to_remove.indexOf(i) === -1) {
                this.row_indexes_to_remove.push(i);
                output = 1;
                // emit message
                const message = 'box label for row ' + i + ') is invalid, samples with this box label will be ignored!';
                this.emitValidationOutput(0, 1, message);
              }
            }
        });
      }
      if (this.boxes_to_create.length === 0 ) {
        output = 2;
      }
    } else {
      // abnormal
      if (this.bLabel.box_sample_separated) {
        // seperated with sample
        if ( this.data.length > this.getContainerCapacity(this.sLabel, this.container)) {
          const message = 'too many samples sample uploaded, not all samples will be uploaed!';
          this.emitValidationOutput(0, 2, message);
          output = 2;
        }
      } else {
        // integered with sample label
        // emit message
        if ( this.data.length > this.getContainerCapacity(this.sLabel, this.container)) {
          const message = 'too many samples sample uploaded, not all samples will be uploaed!';
          this.emitValidationOutput(0, 2, message);
          output = 2;
        }
      }
    }
    return output;
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
        array[3] = shelf;
      }
    } else {
      return [];
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
        array[3] = shelf;
      }
    } else {
      return [];
    }
    return [];
  }

  convertBoxLabel2Number (lArray: Array<string>, type: string, bLabel: BoxLabel, container: Container): number {
    const type_array = ['tower', 'shelf', 'box'];
    const type_index = type_array.indexOf(type.toLowerCase());
    if (type_index === -1) {
      return null;
    }
    if (bLabel.tower === 1) {
      //  is digits
      if (!isNaN(+lArray[type_index]) && Number.isInteger(+lArray[type_index]) && +lArray[type_index] <= container.tower) {
        return +lArray[type_index]
      }
    } else {
      //  is letters
      // test only word
      if (/^[a-zA-Z]+$/.test(lArray[type_index])) {
        // onvert letters to  digits
        const result = this.utilityService.convertLetters2Integer(lArray[type_index]);
        if (result >= 0 && result <= container.tower) {
          return result;
        }
      }
    }
    return null;
  }

  getContainerCapacity(sLabel: SampleLabel, container: Container) {
    const total_boxes = container.tower * container.shelf * container.box;
    const max_sample_per_box = this.utilityService.convertLetters2Integer(sLabel.box_vertical) * sLabel.box_horizontal;
    return total_boxes * max_sample_per_box;
  }

  // scrool to bottom
  scrollToBottom(): void {
    try {
        this.messageBox.nativeElement.scrollTop = this.messageBox.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

}
