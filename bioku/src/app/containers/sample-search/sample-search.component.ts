import { Component, OnInit } from '@angular/core';
import { SampleSearch } from '../../_classes/Sample';
@Component({
  selector: 'app-sample-search',
  templateUrl: './sample-search.component.html',
  styleUrls: ['./sample-search.component.css']
})
export class SampleSearchComponent implements OnInit {
  searchObj: SampleSearch = null;
  constructor() { }

  ngOnInit() {}


  captureSearchObj(obj: SampleSearch){
    this.searchObj = obj;
  }

}
