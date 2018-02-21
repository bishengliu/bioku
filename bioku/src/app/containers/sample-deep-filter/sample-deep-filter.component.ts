import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sample-deep-filter',
  templateUrl: './sample-deep-filter.component.html',
  styleUrls: ['./sample-deep-filter.component.css']
})
export class SampleDeepFilterComponent implements OnInit {
  @Output() deepSampleFilter: EventEmitter<string> = new EventEmitter<string> ();
  @ViewChild('filterValue') filterValue: ElementRef;
  constructor() { }

  ngOnInit() {
    Observable.fromEvent(this.filterValue.nativeElement, 'keyup')
              .map((e: any) => e.target.value)
              // .filter((val:string)=>val != null && val != "")
              .debounceTime(250)
              .subscribe((val: string) => {
                if (val === '' || val === null) {
                  this.deepSampleFilter.emit('');
                } else {
                  this.deepSampleFilter.emit(val);
                }
              });
  }

}
