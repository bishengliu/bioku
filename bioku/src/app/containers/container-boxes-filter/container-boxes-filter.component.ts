import { Component, OnInit, Inject, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Container } from '../../_classes/Container';
import { Router, ActivatedRoute } from '@angular/router';
import { Box, BoxFilter } from '../../_classes/Box';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';

@Component({
  selector: 'app-container-boxes-filter',
  templateUrl: './container-boxes-filter.component.html',
  styleUrls: ['./container-boxes-filter.component.css']
})
export class ContainerBoxesFilterComponent implements OnInit {
  currentContaner: Container= null;
  currentBox: Box = null;
  filterObj: BoxFilter = {
    'tower': -1,
    'shelf': -1,
    'box': -1 }

  @Output() boxFilter: EventEmitter<BoxFilter> = new EventEmitter<BoxFilter> ();
  //access dom
  @ViewChild('tower') towerInput:ElementRef;
  @ViewChild('shelf') shelfInput:ElementRef;
  @ViewChild('box') boxInput:ElementRef;

  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, 
              private router: Router) 
  {
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.updateState();
  }
  updateState(){
    let state = this.appStore.getState();
    if (state.containerInfo && state.containerInfo.currentContainer){
      this.currentContaner = state.containerInfo.currentContainer;
      this.currentBox = state.containerInfo.currentBox;
    }
  }

  ngOnInit() {
    //tower
    Observable.fromEvent(this.towerInput.nativeElement, 'keyup')
              .map((e:any) => e.target.value)
              .map((num:number) => {
                let val: number = -1;
                if(!isNaN(+num) && +num > 0){
                  val = +num;}
                if(!isNaN(+num) && +num > this.currentContaner.tower){
                  val = this.currentContaner.tower;}
                return val;
               })
              .debounceTime(250)
              .subscribe((num: number)=> {
                console.log(num);
                this.filterObj.tower= num;
                this.boxFilter.emit(this.filterObj);
              });
    //shelf
    Observable.fromEvent(this.shelfInput.nativeElement, 'keyup')
              .map((e:any) => e.target.value)
              .map((num:number) => {
                let val: number = -1;
                if(!isNaN(+num) && +num > 0){
                  val = +num;}
                if(!isNaN(+num) && +num > this.currentContaner.shelf){
                  val = this.currentContaner.shelf;}
                return val;
               })
              .debounceTime(250)
              .subscribe((num: number)=> {
                this.filterObj.shelf= num;
                this.boxFilter.emit(this.filterObj);
              });
    //box
    Observable.fromEvent(this.boxInput.nativeElement, 'keyup')
              .map((e:any) => e.target.value)
              .map((num:number) => {
                let val: number = -1;
                if(!isNaN(+num) && +num > 0){
                  val = +num;}
                if(!isNaN(+num) && +num > this.currentContaner.box){
                  val = this.currentContaner.box;}
                return val;
               })
              .debounceTime(250)
              .subscribe((num: number)=> { 
                this.filterObj.box= num;
                this.boxFilter.emit(this.filterObj);
              });
  }
}
