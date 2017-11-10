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
  row_indexes_to_remove: Array<number> = []; // rows that failed the validation, only for validaiton messages
  boxes_to_create: Array<Array<number>> = []; // for following tower-shelf-box
  abnormal_boxes_to_create: Array<any> = []; // for not following tower-shelf-box
  validator_under_going: Boolean = true;
  saving_sample_posting_validation: Boolean = false;
  validator_failed: Boolean = false;
  validation_finished: Boolean = false;
  sampleValidator: SampleValidator = new SampleValidator();
  data: Array<Array<any>> []; // for keep the origin nal copy
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
    this.sampleValidator.validation_steps = ['validating sample names ...' , 'validating box labels ...', 'validating sample labels ...'];
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
  // box label validation
  // aim is to check box labels and return the valid boxes, boxes to create, row_index_to_remove
  sampleValidation () {
    // if this.data.length === 0
    this.validateDataLength(true); // inital validation
    // validate name col
    if (!this.validator_failed && this.data.length > 0) {
      this.validateSampleName();
      // filter the data
      this.data = this.filterValidSamples(this.data);
    }
    this.validateDataLength(false);
    // only when the file has box label
    if (!this.validator_failed && this.bLabel.box_has_label && this.data.length > 0) {
      // step one check box label
      this.validateBoxLabel();
      this.data = this.filterValidSamples(this.data);
    }
    if (!this.validator_failed && !this.bLabel.box_has_label) {
      // no box validation is required
      const message = 'your samples have no box labels, box label validation is skipped.';
      this.emitValidationOutput(0, 3, message);
    }
    this.validateDataLength(false);
    // console.log(this.data);
    if (!this.validator_failed && this.data.length > 0) {
      // valid sample labels after box label
      this.validateSampleLabel();
      this.data = this.filterValidSamples(this.data);
    }
    console.log(this.data);
    this.validateDataLength(false);

    // valiate date format /////////////
    // final outcome
    this.passAllValidation();
  }
  // validate samle names
  validateSampleName () {
    // set pointer
    this.sampleValidator.validator_pointer = 0;
    // emit step
    this.valiadtionStep$.next(this.getValidationStep(this.sampleValidator.validator_pointer));
    // emit messages
    const message = 'start to validate sample names ...';
    this.emitValidationOutput(0, 3, message);
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
    let message = 'start to validate box labels ...';
    this.emitValidationOutput(0, 3, message);
    // emit messages
    message = this.bLabel.box_defined_as_normal
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
    this.emitValidationOutput(0, 3, message);
    // final check
    // parse box labels
    const sample_label_validation_output = this.parseSampleLabel();
    this.checkValidationOutcome(sample_label_validation_output, 'sample labels');
  }

  validateFreezingDateFormat() {}

  // general clean the data after all validation
  formatData() {}

  validateServerSerializer() {}

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

  emitValidationOutput(validation_step: number, status: number, message: string) {
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
    this.emitValidationOutput(0, 3, message);
    // validate sample names
    this.data.forEach( (d, i) => {
      const sample_name = d[( '' + (sample_name_col - 1) )];
      if (sample_name === '') {
         // sample is null, sample invalid
         d['invalid'] = true;
         this.updateRowToRemove4SampleNameValidation(i);
         output = 1;
      } else {
        d['name'] = sample_name;
        d['invalid'] = false;
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
        this.validNormal1Col();
      } else {
        // 3 cols
        this.validNormal3Col();
      }
      // validate box count
      if (this.boxes_to_create.length === 0 ) {
        output = 2;
        const message = 'no box label is valid; no box to create!';
        this.emitValidationOutput(0, 2, message);
      } else {
        // filter the repeats in the array
        this.boxes_to_create = this.removeRepeatedBoxes(this.boxes_to_create);
        if (this.boxes_to_create.length > max_boxes_of_conatiner) {
          output = 1;
          const message = 'too many boxes founded, not all samples will be uploaded!';
          this.emitValidationOutput(0, 1, message);
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
        this.emitValidationOutput(0, 2, message);
      }
      if (this.abnormal_boxes_to_create.length > max_boxes_of_conatiner) {
        output = 1;
        const message = 'too many boxes founded, not all samples will be uploaded!';
        this.emitValidationOutput(0, 1, message);
      }
    }
    return output;
  }
  parseSampleLabel() {
    let output = 0; // default passed
    // validate sample labels and sample numbe in a box
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
      const has_warning = this.validSampleLabelIncreasingNumber();
      if (has_warning) {
        output = 1;
      }
    }
    return output;
  }
  validNormal1Col() {
    const box_label_header = this.getColumnByHeader('BoxLabel');
    // format data and test
    this.data.forEach((d: Array<any>, i) => {
      let box_label = d[( '' + (box_label_header - 1) )];
      if (box_label === '') {
        // box label is null, sample invalid
        d['invalid'] = true;
        this.updateRowToRemove4BoxLabelValidation(i);
      } else {
        // get the box label patthern
        // trim the label;
        if (this.bLabel.prefix !== '' && this.bLabel.prefix != null
          && box_label.toLowerCase().startsWith(this.bLabel.prefix.toLowerCase())) {
          const prefix_index = box_label.toLowerCase().indexOf(this.bLabel.prefix.toLowerCase());
          d[('' + (box_label_header - 1))] = box_label.substring(prefix_index);
        }
        box_label = d[('' + (box_label_header - 1))];
        if (this.bLabel.appendix !== '' && this.bLabel.appendix != null
          && box_label.toLowerCase().endsWith(this.bLabel.appendix.toLowerCase())) {
          const appendix_index = box_label.toLowerCase().indexOf(this.bLabel.appendix.toLowerCase());
          d[('' + (box_label_header - 1))] = box_label.substring(0, appendix_index);
        }
        box_label = d[('' + (box_label_header - 1))];
        // test the label, retrun parsed box label array or null
        const label_array = this.testBoxLabel1Col(box_label, this.bLabel, this.container);
        if (label_array.length > 0) {
          // validate tower, shelf and box
          if ( this.testTowerShelfBox(label_array, i)) {
            d['tower'] = label_array[0];
            d['shelf'] = label_array[1];
            d['box'] = label_array[2];
            d['invalid'] = false;
            this.boxes_to_create.push(label_array); // need filter out the duplicates later on
          } else {
            d['invalid'] = true;
            this.updateRowToRemove4BoxLabelValidation(i);
          }
        } else {
          d['invalid'] = true;
          this.updateRowToRemove4BoxLabelValidation(i);
        }
      }
    })
  }
  validNormal3Col() {
    const box_label_tower = this.getColumnByHeader('BoxLabel_Tower');
    const box_label_shelf = this.getColumnByHeader('BoxLabel_Shelf');
    const box_label_box = this.getColumnByHeader('BoxLabel_Box');
    this.data.forEach( (d: Array<any>, i) => {
      if ( d[( '' + (box_label_tower - 1) )] === null
        || d[( '' + (box_label_shelf - 1) )] === null
        || d[( '' + (box_label_box - 1) )] === null ) {
        d['invalid'] = true;
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
            d['invalid'] = false;
            this.boxes_to_create.push(label_array); // need filter out the duplicates later on
          } else {
            d['invalid'] = true;
            this.updateRowToRemove4BoxLabelValidation(i);
          }
        } else {
          d['invalid'] = true;
          this.updateRowToRemove4BoxLabelValidation(i);
        }
      }
    });
  }
  validAbnormalSeparated(): boolean {
    let too_many_samples = false;
    // seperated with sample
    if ( this.data.length > this.getContainerCapacity(this.sLabel, this.container)) {
      // dn not mark samples as invalid, will be checked during sample label validation
      const message = 'too many samples sample uploaded, not all samples will be uploaded!';
      this.emitValidationOutput(0, 1, message);
      too_many_samples = true;
    };
    // validate max boxes
    const box_label_header = this.getColumnByHeader('BoxLabel');
    this.data.forEach((d, i) => {
      const box_label = '' + d[( '' + (box_label_header - 1) )];
      if (box_label !== null) {
        if (this.abnormal_boxes_to_create.indexOf(box_label.toLowerCase()) === -1 ) {
          this.abnormal_boxes_to_create.push(box_label.toLowerCase()); // no repeats
        }
      } else {
        d['invalid'] = true;
        // add row to remove
        this.updateRowToRemove4BoxLabelValidation(i);
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
      this.emitValidationOutput(0, 1, message);
      too_many_samples = true;
    }
    // box label is validated with sample labels
    // first need to seperate box labels and sample labels
    // box and sample label must be seperated with a symbol
    // split the box label and sample label ///////////////////////////////////////////////
    const sample_header_col = this.getColumnByHeader('SampleLabel');
    this.data.forEach( (d, i) => {
      const sample_label = '' + d[( '' + (sample_header_col - 1) )];
      // splite the sample label to get the box label
      // box_join cannot be nothing
      const box_join = this.sLabel.boxJoin;
      if (box_join === '' || box_join === null) {
        d['invalid'] = true;
        // add row to remove
        this.updateRowToRemove4BoxLabelValidation(i);
      } else {
        // box_join === sample_join ?
        if (sample_label.indexOf(box_join) !== -1 && sample_label.length === sample_label.indexOf(box_join) + 1) {
          const box_label = sample_label.substring(0, sample_label.indexOf(box_join)); // only accept in the begin
          const new_sample_label = sample_label.substring(sample_label.indexOf(box_join) + 1);
          // update sample label
          d[( '' + (sample_header_col - 1) )] = new_sample_label;
          // validate box_label
          if (box_label !== null) {
            if (this.abnormal_boxes_to_create.indexOf(box_label.toLowerCase()) === -1 ) {
              this.abnormal_boxes_to_create.push(box_label.toLowerCase()); // no repeats
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
  // test whether tower, shelf and box is valid > max allowed number
  testTowerShelfBox(label_array: Array<number>, index: number): boolean {
    const type_array = ['tower', 'shelf', 'box'];
    label_array.forEach((t, i) => {
      if ( label_array[i] > this.container[type_array[i]]) {
        const message = type_array[i] + ' position in the box label for row ' + index + ' is invalid, this sample will be ignored!';
        this.emitValidationOutput(0, 1, message);
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
  getContainerTotalBoxes(container: Container) {
    return container.tower * container.shelf * container.box;
  }
  updateRowToRemove4BoxLabelValidation(index: number) {
    if (this.row_indexes_to_remove.indexOf(index) === -1) {
      this.row_indexes_to_remove.push(index);
      // emit message
      const message = 'box label for row ' + index + ' is invalid, this sample will be ignored!';
      this.emitValidationOutput(0, 1, message);
    }
  }
  updateRowToRemove4SampleNameValidation(index: number) {
    if (this.row_indexes_to_remove.indexOf(index) === -1) {
      this.row_indexes_to_remove.push(index);
      // emit message
      const message = 'sample name for row ' + index + ' is invalid, this sample will be ignored!';
      this.emitValidationOutput(0, 1, message);
    }
  }
  updateRowToRemove4SampleLabelValidation(index: number) {
    if (this.row_indexes_to_remove.indexOf(index) === -1) {
      this.row_indexes_to_remove.push(index);
      // emit message
      const message = 'sample label for row ' + index + ' is invalid, this sample will be ignored!';
      this.emitValidationOutput(0, 1, message);
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
      this.abnormal_boxes_to_create.sort();
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
      this.data = this.filterValidSamples(this.data);
      // appliy invalid == true
      this.data.forEach( (d, i) => {
        if (separated) {
          const box_label = '' + d[( '' + (header_col - 1) )];
          if (abnormal_boxes_to_remove.indexOf(box_label.toLowerCase()) !== -1) {
            d['invalid'] = true;
            // add row to remove
            this.updateRowToRemove4BoxLabelValidation(i);
          }
        } else {
          // integreted
          const sample_label = '' + d[( '' + (header_col - 1) )];
          const box_join = this.sLabel.boxJoin;
          if (sample_label.indexOf(box_join) !== -1) {
            const box_label = sample_label.substring(0, sample_label.indexOf(box_join)); // only accept in the begin
            if (abnormal_boxes_to_remove.indexOf(box_label.toLowerCase()) !== -1) {
              d['invalid'] = true;
              // add row to remove
              this.updateRowToRemove4BoxLabelValidation(i);
            }
          }
        }
      });
      // filter the samples again
      ////////////// UNCOMENT THIS AFTER FINISH ///////////////////
      this.data = this.filterValidSamples(this.data);
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
            const sample_label = '' + d[( '' + (header_col - 1) )];
            const box_join = this.sLabel.boxJoin;
            if (sample_label.indexOf(box_join) !== -1) {
              box_label = sample_label.substring(0, sample_label.indexOf(box_join)); // only accept in the begin
            }
          }
          if (box_label.toLowerCase() === blabel) {
            d['tower'] = box_label_array[0];
            d['shelf'] = box_label_array[1];
            d['box'] = box_label_array[2];
            d['invalid'] = false;
          }
        });
      });
    }
  }
  validSampleLabel1Col(): boolean {
    let has_warning = false;
    // SampleLabel
    const sample_label_col = this.getColumnByHeader('SampleLabel');
    // get the max sample in a box
    const max_sample_count = this.getMaxSamplePerBox();
    this.data.forEach((d, i) => {
      const sample_label = '' + d[( '' + (sample_label_col - 1) )];
      let invalid = false;
      let row_valid = false; 
      let col_valid = false;
      if (sample_label === '') {
        invalid = true;
      } else {
        // sample join
        const sample_join = this.sLabel.sampleJoin;
        if (sample_label.indexOf(sample_join) === -1) {
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
            if ( (/^[0-9]+$/.test(sample_row)) && +this.sLabel.box_horizontal >= +sample_row ) {
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
            && (this.utilityService.convertLetters2Integer(this.sLabel.box_vertical) >= +sample_col)) {
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
            d['invalid'] = false;
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
    // SampleLabel_Row and SampleLabel_Column
    const sample_label_row = this.getColumnByHeader('SampleLabel_Row');
    const sample_label_col = this.getColumnByHeader('SampleLabel_Column');
    return has_warning;
  }
  validSampleLabelIncreasingNumber(): boolean {
    let has_warning = false;
    // SampleLabel
    const sample_label_col = this.getColumnByHeader('SampleLabel');
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
        for (let b = 0; b < container.tower; b++) {
          const array = []
          array[0] = t; array[1] = s; array[2] = b;
          bArray.push(array);
        }
      }
    }
    return bArray;
  }
  getMaxSamplePerBox(): number {
    return this.utilityService.convertLetters2Integer(this.sLabel.box_vertical) * this.sLabel.box_horizontal
  }
  checkValidationOutcome(output: number, type: string) {
    let message = '';
    if (output  === 0) {
      message = 'validate ' + type + ' passed';
      this.emitValidationOutput(0, 0, message);
    } else if (output  === 1) {
      message = 'validate ' + type + ' passed with warning, samples with invalid ' + type + ' will be ignored!';
      this.emitValidationOutput(0, 1, message);
    } else {
      message = 'validate ' + type + ' failed, please fix ' + type + ' before proceeding further!';
      this.emitValidationOutput(0, 2, message);
      this.validator_failed = true;
    }
  }
  validateDataLength(initial: boolean) {
    if (this.data === undefined  || this.data.length === 0) {
      const message = initial
      ?
      'no sample to validate, please make sure the file uploaded is not empty!' :
      'no valid sample left, validation stopped!';
      this.emitValidationOutput(0, 2, message);
      this.validator_failed = true;
    }
  }
  passAllValidation () {
    if (!this.validator_failed) {
      this.validation_finished = true;
      this.valiadtionStep$.next('validation finished.');
      // emit messages
      const message = 'all validations passed! You may want to check the possible warning outputs';
      this.emitValidationOutput(0, 0, message);
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
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
}
