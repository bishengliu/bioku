import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-container-sample-upload-helper',
  templateUrl: './container-sample-upload-helper.component.html',
  styleUrls: ['./container-sample-upload-helper.component.css']
})
export class ContainerSampleUploadHelperComponent implements OnInit {
  box_defined_as_normal: Boolean = true;
  box_tsb_one_column: Boolean = true; // "tower", "shelf" and "box" in one data column
  box_sample_separated: Boolean = true; // box position is separated from sample position in my excel
  activeStep: Number = 1;
  constructor() { }

  ngOnInit() {
  }
  toggleBoxPositionDefinition() {
    this.box_defined_as_normal = !this.box_defined_as_normal;
  }
  toggleBoxTSBColumn() {
    this.box_tsb_one_column = !this.box_tsb_one_column;
  }
  toggleBoxSampleSeparated() {
    this.box_sample_separated = !this.box_sample_separated;
  }
}
