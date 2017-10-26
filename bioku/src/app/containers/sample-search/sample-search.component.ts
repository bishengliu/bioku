import { Component, OnInit } from '@angular/core';
import { SampleSearch, Sample } from '../../_classes/Sample';
import {  ContainerService } from '../../_services/ContainerService';
// ng2-sticky
// import { Ng2StickyModule } from 'ng2-sticky';

@Component({
  selector: 'app-sample-search',
  templateUrl: './sample-search.component.html',
  styleUrls: ['./sample-search.component.css']
})
export class SampleSearchComponent implements OnInit {
  searchObj: SampleSearch = null;
  samples: Array<Sample> = new Array<Sample>();
  searching: Boolean = false;
  searched: Boolean = false;
  show_error: Boolean = false;
  // search again
  toogleSearch: Boolean = false;
  searchAgain: Boolean = false;
  // clicked and selected samples
  selectedSamplePks: Array<number> = [];
  selectedSamples: Array<Sample> = new Array<Sample>();
  constructor(private containerService: ContainerService) { }

ngOnInit() {}

captureSearchObj(obj: SampleSearch) {
  this.searchObj = obj;
  this.samples = null;
  this.searching = true;
  this.show_error = false;
  this.containerService.SearchSample(this.searchObj)
      .subscribe(
        (samples: Array<Sample>) => {
          // console.log(samples); // sample found ...
          this.samples = [...samples];
          this.searching = false;
          this.toogleSearch = true;
          this.searched = true;
        },
        (err) => {
          console.log(err);
          this.searching = false;
          this.show_error = true;
          this.toogleSearch = true;
          this.searched = false;
        }
      );
}

captureSampleSelected(pks: Array<number>) {
  this.selectedSamplePks = [...pks];
  this.selectedSamples = this.getSampleSelected(this.selectedSamplePks, this.samples);
}
// get selected samples
getSampleSelected(pks: Array<number>, samples: Array<Sample>): Array<Sample> {
  const SelectedSamples: Array<Sample> = new Array<Sample>();
  if (samples.length > 0 && pks.length > 0) {
    return samples.filter((s, i) => {
      return pks.indexOf(s.pk) !== -1;
    })
  } else {
    return SelectedSamples;
  }
}

showAgain() {
    this.samples = [];
    this.searchAgain = !this.searchAgain;
    this.show_error = false;
    this.searching = false;
    this.searched = false;
  }
}
