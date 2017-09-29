import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Sample } from '../../_classes/Sample';

@Component({
  selector: 'app-sample-search-result',
  templateUrl: './sample-search-result.component.html',
  styleUrls: ['./sample-search-result.component.css']
})
export class SampleSearchResultComponent implements OnInit {
  @Input() samples: Array<Sample>;
  selectedSamples: Array<number> =[] //sample pk
  @Output() sampleSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>> ();
  constructor() { }

  ngOnInit() {
    this.sampleSelected.emit([]);//emit empty sample selected
  }

  toggleSelection(pk: number){
    if(pk != null){
      let index = this.selectedSamples.indexOf(pk);
      if(index === -1){
        this.selectedSamples.push(pk);
      }
      else{
        this.selectedSamples.splice(index, 1);
      }
    }
    //emit observable
    this.sampleSelected.emit(this.selectedSamples);
  }
  ngOnChanges(){
    this.selectedSamples = []; //clear selected samples
    this.sampleSelected.emit([]); //emit selected sample pk
  }
}
