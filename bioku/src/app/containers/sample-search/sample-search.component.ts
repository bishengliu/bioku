import { Component, OnInit } from '@angular/core';
import { SampleSearch, Sample } from '../../_classes/Sample';
import {  ContainerService } from '../../_services/ContainerService';
//ng2-sticky
//import { Ng2StickyModule } from 'ng2-sticky';

@Component({
  selector: 'app-sample-search',
  templateUrl: './sample-search.component.html',
  styleUrls: ['./sample-search.component.css']
})
export class SampleSearchComponent implements OnInit {
  searchObj: SampleSearch = null;
  samples: Array<Sample> = new Array<Sample>();
  searching: boolean = false;
  searched: boolean = false;
  show_error: boolean = false;
  //search again
  toogleSearch: boolean = false;
  searchAgain: boolean = false;
  //clicked and selected samples
  selectedSamples: Array<number> = []; 
  constructor(private containerService: ContainerService) { }

ngOnInit() {}

captureSearchObj(obj: SampleSearch){
  this.searchObj = obj;
  this.samples = null;
  this.searching = true;
  this.show_error = false;
  this.containerService.SearchSample(this.searchObj)
      .subscribe(
        (samples: Array<Sample>)=>{
          console.log(samples); // sample found ...
          this.samples = [...samples];
          this.searching = false;
          this.toogleSearch = true;
          this.searched = true;
        },
        (err)=>{
          console.log(err);
          this.searching = false;
          this.show_error = true;
          this.toogleSearch = true;
          this.searched = false;
        }
      );    
}

captureSampleSelected(pks: Array<number>){
  this.selectedSamples = [...pks];
}

showAgain(){
  this.samples= [];
  this.searchAgain = !this.searchAgain;
  this.show_error = false;
  this.searching = false;
  this.searched = false;
}
}