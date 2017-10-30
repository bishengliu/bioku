import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-container-sample-upload-helper',
  templateUrl: './container-sample-upload-helper.component.html',
  styleUrls: ['./container-sample-upload-helper.component.css']
})
export class ContainerSampleUploadHelperComponent implements OnInit {
  // step 1
  box_defined_as_normal: Boolean = true;
  box_tsb_one_column: Boolean = true; // "tower", "shelf" and "box" in one data column
  box_sample_separated: Boolean = true; // box position is separated from sample position in my excel
  activeStep = 1;
  prefix = '';
  appendix = '';
  join = '-';
  tower = 1;
  shelf = 1;
  box = 1;
  // end step 1
  // step 2
  sampleLabelDefinition = 0; // row-column in on data column; 1: in 2 columns; 2: increasing numbers
  // samplePrefix = '';
  boxLabel = 0;
  boxJoin = '';
  sampleRow = 0;
  sampleColumn = 1;
  sampleJoin = '';
  // sampleAppendix = '';
  constructor() { }

  ngOnInit() {
  }
  // step 1
  toggleBoxPositionDefinition() {
    this.box_defined_as_normal = !this.box_defined_as_normal;
  }
  toggleBoxTSBColumn() {
    this.box_tsb_one_column = !this.box_tsb_one_column;
  }
  toggleBoxSampleSeparated() {
    this.box_sample_separated = !this.box_sample_separated;
  }
  // updatePrefix(evt: any) {
  //   this.prefix = evt;
  // }
  updateTower(evt: any) {
    this.tower = evt;
  }
  updateShelf(evt: any) {
    this.shelf = evt;
  }
  updateBox(evt: any) {
    this.box = evt;
  }
  updateJoin(evt: any) {
    this.join = evt;
  }
  updateAppendix(evt: any) {
    this.appendix = evt;
  }
  saveFirstStep() {
    this.activeStep = this.activeStep + 1;
  }
  // end step 1

  // step 2
  updateSampleLabelDefinition (evt: any) {
    this.sampleLabelDefinition = evt;
  }
  // updateSamplePrefix(evt: any) {
  //   this.samplePrefix = evt;
  // }
  updateBoxLabel(evt: any) {
    this.boxLabel = evt;
  }
  updateBoxJoin(evt: any) {
    this.boxJoin = evt;
  }
  updateSampleRow(evt: any) {
    this.sampleRow = evt;
  }
  updateSampleColumn(evt: any) {
    this.sampleColumn = evt;
  }
  updateSampleJoin(evt: any) {
    this.sampleJoin = evt;
  }
  // updateSampleAppendix(evt: any) {
  //   this.sampleAppendix = evt;
  // }

  backFirstStep() {
    this.activeStep = this.activeStep - 1;
  }
  saveSecondStep() {
    this.activeStep = this.activeStep + 1;
  }
  // end step 2
}
