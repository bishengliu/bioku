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
  SampleMatched: Array<Sample> = new Array<Sample>();
  constructor(private containerService: ContainerService) { }

ngOnInit() {}

captureSearchObj(obj: SampleSearch){
  this.searchObj = obj;
  this.SampleMatched = null;
  this.containerService.SearchSample(this.searchObj)
      .subscribe(
        ()=>{},
        (err)=>{console.log(err);}
      );    
  }
}
