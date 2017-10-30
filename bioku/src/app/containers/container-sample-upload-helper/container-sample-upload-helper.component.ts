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
  updatePrefix(evt: any) {
    this.prefix = evt;
    console.log(this.prefix);
  }
  updateTower(evt: any) {
    this.tower = evt;
    console.log(this.tower);
  }
  updateShelf(evt: any) {
    this.shelf = evt;
    console.log(this.shelf);
  }
  updateBox(evt: any) {
    console.log(evt);
    this.box = evt;
  }
  updateJoin(evt: any) {
    this.join = evt;
    console.log(this.join);
  }
  updateAppendix(evt: any) {
    this.appendix = evt;
    console.log(this.appendix);
  }
  saveFirstStep() {
    this.activeStep = this.activeStep + 1;
  }
  // end step 1
}
