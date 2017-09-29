import { Component, OnInit } from '@angular/core';
import { SampleSearch, Sample } from '../../_classes/Sample';
import {  ContainerService } from '../../_services/ContainerService';

@Component({
  selector: 'app-sample-search',
  templateUrl: './sample-search.component.html',
  styleUrls: ['./sample-search.component.css']
})
export class SampleSearchComponent implements OnInit {
  searchObj: SampleSearch = null;
  samples: Array<Sample> = new Array<Sample>();
  searching: boolean = false;
  show_error: boolean = false;
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
          console.log(samples);
          this.samples = [...samples];
          this.searching = false;
        },
        (err)=>{
          console.log(err);this.searching = false;
          this.show_error = true;
        }
      );    
}

captureSampleSelected(data: any){
  console.log(data);
}

}