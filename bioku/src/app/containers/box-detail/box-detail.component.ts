import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { Container } from '../../_classes/Container';
import { Box, BoxFilter } from '../../_classes/Box';
import { Sample, SampleFilter, Attachment } from '../../_classes/Sample';
import {  ContainerService } from '../../_services/ContainerService';
import {  UtilityService } from '../../_services/UtilityService';
import { RefreshService } from '../../_services/RefreshService';
//redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';
import { SetCurrentBoxAction, setCurrentBoxActionCreator } from '../../_redux/container/container_actions';
//ng2-sticky
//import { Ng2StickyModule } from 'ng2-sticky';
@Component({
  selector: 'app-box-detail',
  templateUrl: './box-detail.component.html',
  styleUrls: ['./box-detail.component.css']
})
export class BoxDetailComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  //route param
  ct_pk: number;
  box_pos: string;
  private sub: any; //subscribe to params observable
  private querySub: any;
  container: Container = null;
  box: Box = null;
  samples: Array<Sample> = [];
  searchedSamples: Array<Sample> = [];//for list view only
  selectedSamples: Array<number> = []; //for list view and box view
  selectedCells: Array<string> = []; //for box view only
  searchedBoxSamples: Array<string> = []; //cell position
  box_view: boolean = true;
  constructor(private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore, private refreshService: RefreshService,
              private router: Router, private containerService: ContainerService, private alertService: AlertService, private utilityService: UtilityService)
  { 
    //subscribe store state changes
    appStore.subscribe(()=> this.updateState());
    this.refreshService.dispatchContainerInfo();
  }

  updateState(){
    let state = this.appStore.getState();
    if (state.containerInfo && state.containerInfo.currentContainer){
      this.container = state.containerInfo.currentContainer;
    }
    if (state.containerInfo && state.containerInfo.currentBox){
      this.box = state.containerInfo.currentBox;
    }
  }
  
  //toggle view setting
  toggleList(){
    this.box_view = !this.box_view;
    //empty all the arrays
    this.selectedCells = [];
    this.selectedSamples = [];
  }

  //filter output
  updateSampleList(sampleFilter: SampleFilter){
    this.loading = true;
    //empty all the arrays
    this.selectedCells = [];
    this.selectedSamples = [];
    //restore the complete samples for list view
    //hard copy of the array
    this.searchedSamples = this.samples.filter((e:Sample) => e.pk != null);
    //empty searched samples for box view
    this.searchedBoxSamples = [];
    //filter the machted boxes
    if(sampleFilter.value != null){
        this.searchedSamples = this.samples.filter((e: Sample)=> {
        if(sampleFilter.key=="label"){
          //get the attachment label
          if (e.attachments != null && e.attachments.length > 0){
            let attachments: Array<Attachment> = [];
            attachments = e.attachments.filter((a:Attachment)=> a.label.toLowerCase().indexOf(sampleFilter.value.toLowerCase()) !== -1);
            if (attachments != null && attachments.length > 0){
              return true;}
          }
        }
        else if(sampleFilter.key=="quantity"){
          if(e.quantity === +sampleFilter.value) {
            return true;}         
        }
        else{
          if(e[sampleFilter.key] == null){
            return false;
          }
          else{
            if(e[sampleFilter.key].toLowerCase().indexOf(sampleFilter.value.toLowerCase()) !== -1)
            { return true; }
          }          
        }
        return false;
      });
      //for box searched samples
       let matchedBoxSamples = this.searchedSamples.filter((s:Sample)=>s.occupied == true);
       matchedBoxSamples.forEach((s:Sample)=>this.searchedBoxSamples.push(s.position));
    };
    this.loading = false;
  }

  //capture emit from sample-table
  captureSampleSelected(pks: Array<number>){
    this.selectedSamples = pks;
  }

  captureCellSelected(cells: Array<string>){
    this.selectedCells = cells;
  }

  ngOnInit() {
    this.sub = this.route.params
      .mergeMap(params=>{
        this.ct_pk = +params['ct_pk'];
        this.box_pos = params['box_pos'];
        this.querySub = this.route.queryParams
        return this.querySub;
      })
      .mergeMap((params)=>{
        if(params && params['second_container'] != undefined && params['second_box_position'] != undefined){
          //find only one box
          //redirection
          this.router.navigate(['/containers', this.ct_pk, this.box_pos, 'move_samples'], 
          { queryParams: { 'second_container': params['second_container'], 'second_box_position': params['second_box_position'] } });
          return Observable.of(this.container);
        }
        else{
          if(this.container != null){
            return Observable.of(this.container);
          }else{           
            return this.containerService.containerDetail(this.ct_pk)
          }
        }
      })     
      .mergeMap((container: any)=>{
        //set the container
        this.container = container;
        if(this.box != null){
            return Observable.of(this.box);}
        else{
          //get group boxes of the container
          return this.containerService.getContainerBox(this.ct_pk, this.box_pos);}        
      })
      .subscribe((box: Box)=>{
        this.box = box;
        //get samples
        this.samples = this.box.samples
          .sort(this.utilityService.sortArrayByMultipleProperty('vposition', 'hposition'))
          .sort(this.utilityService.sortArrayBySingleProperty('-occupied'));
        this.searchedSamples = this.samples;
        this.loading = false;
      },        
      () => this.alertService.error('Something went wrong, fail to load the box from the server!', true));
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

}
