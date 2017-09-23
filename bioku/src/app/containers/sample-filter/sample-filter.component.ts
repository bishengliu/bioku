import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SampleFilter } from '../../_classes/Sample';

@Component({
  selector: 'app-sample-filter',
  templateUrl: './sample-filter.component.html',
  styleUrls: ['./sample-filter.component.css']
})
export class SampleFilterComponent implements OnInit {
  keywords: Array<string> = [];
  parsedKeys: Array<string> = [];
  filterBy: number = null;
  keyIsNotSelected: boolean = true;
  filterFor: string = null;
  filterObj: SampleFilter = {'key': null, 'value': null }
  @Output() sampleFilter: EventEmitter<SampleFilter> = new EventEmitter<SampleFilter> ();
  @ViewChild('filterkey') filterkey:ElementRef;
  @ViewChild('filterValue') filterValue:ElementRef;

  constructor() {
    this.keywords = [ 'by sample type', 'by sample name', 'by sample code', 'by sample tag', 'by sample comments'];
    this.parsedKeys = [ 'type', 'name', 'registration_code', 'tag', 'description'];
  }
  
  ngOnInit() {
    Observable.fromEvent(this.filterkey.nativeElement, 'change')
              .map((e:any) => e.target.value)
              .map((num:number) => {
                  this.keyIsNotSelected = true;
                  this.filterValue.nativeElement.value = null;
                  if(+num >= 0){
                    this.keyIsNotSelected = false;
                    return this.parsedKeys[+num];}
                  return null;
              })
              .subscribe((key:string)=> {
                this.filterObj.key = key;
                this.filterObj.value = null;
                this.sampleFilter.emit(this.filterObj);   
              });
    Observable.fromEvent(this.filterValue.nativeElement, 'keyup')
              .map((e:any) => e.target.value)
              //.filter((val:string)=>val != null && val != "")
              .debounceTime(250)
              .subscribe((val: string)=> {
                if(val == "" || val == null){
                  this.filterObj.value= null;
                  this.sampleFilter.emit(this.filterObj);  
                }
                else{
                  this.filterObj.value= val;
                  this.sampleFilter.emit(this.filterObj);  
                }                              
              });
  }
}
