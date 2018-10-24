import { Component, OnInit, Inject, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { Container } from '../../_classes/Container';
import { Box, BoxFilter } from '../../_classes/Box';
import { Sample, SampleFilter, Attachment } from '../../_classes/Sample';
import { CSample, CAttachment } from '../../_classes/CType';
import { User } from '../../_classes/User';
import {  ContainerService } from '../../_services/ContainerService';
import {  UtilityService } from '../../_services/UtilityService';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';
import { SetCurrentBoxAction, setCurrentBoxActionCreator } from '../../_redux/container/container_actions';
// g2-sticky
// import { Ng2StickyModule } from 'ng2-sticky';
@Component({
  selector: 'app-box-detail',
  templateUrl: './box-detail.component.html',
  styleUrls: ['./box-detail.component.css']
})
export class BoxDetailComponent implements OnInit, OnDestroy {
  loading: Boolean = true;
  // route param
  ct_pk: number;
  box_pos: string;
  private sub: any; // subscribe to params observable
  private querySub: any;
  container: Container = null;
  box: Box = new Box();
  samples = [];
  searchedSamples = []; // for list view only
  selectedSamples: Array<number> = []; // for list view and box view
  selectedCells: Array<string> = []; // for box view only
  searchedBoxSamples: Array<string> = []; // cell position
  box_view: Boolean = true;
  dbClickedSamplePK = -1; // for dbclick
  DbClickCount = 0;
  FRONT_SAMPLE_STRIECT_FILTER = false;
  ALLOW_DOWNLOAD_EXPORT = true;
  USE_CSAMPLE = true;
  // DbClickCount: EventEmitter<number> = new EventEmitter<number> ();
  constructor(private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
              private router: Router, private containerService: ContainerService, private alertService: AlertService,
              private utilityService: UtilityService) {
    this.FRONT_SAMPLE_STRIECT_FILTER = this.appSetting.FRONT_SAMPLE_STRIECT_FILTER;
    this.ALLOW_DOWNLOAD_EXPORT = this.appSetting.ALLOW_DOWNLOAD_EXPORT;
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
    // subscribe store state changes
    appStore.subscribe(() => this.updateState());
    this.updateState();
  }

  updateState() {
    const state = this.appStore.getState();
    if (state.containerInfo && state.containerInfo.currentContainer) {
      this.container = state.containerInfo.currentContainer;
    }
    if (state.containerInfo && state.containerInfo.currentBox) {
      this.box = state.containerInfo.currentBox;
    }
  }

  // toggle view setting
  toggleList() {
    this.box_view = !this.box_view;
    // empty all the arrays
    this.selectedCells = [];
    this.selectedSamples = [];
  }
  updateDeepFilteredSampleList(userInput: string) {
    this.loading = true;
    userInput = userInput.toString().toLowerCase();
    // empty all the arrays
    this.selectedCells = [];
    this.selectedSamples = [];
    // restore the complete samples for list view
    // hard copy of the array
    this.searchedSamples = this.samples.filter((e) => e.pk != null);
    // empty searched samples for box view
    this.searchedBoxSamples = [];
    // filter the machted boxes
    if (userInput !== null && userInput !== '') {
      // split userinput into an array
      const userInputArray = userInput.split('');
      if (userInputArray.length > 0) {
        // loop to the box sample and concat all the text into a string
        this.searchedSamples = this.samples.filter((e) => {
          let deepString = '';
          // loop into the object keys
          // could also use Object.keys(e).forEach()
          for (const key in e) {
            if ( e.hasOwnProperty(key) ) {
              if ( key === 'researchers' ) {
                // only the first letter of first/last name
                e[key].forEach((r: User) => {
                  if (r.first_name !== null && r.first_name !== '') {
                    deepString += (r.first_name.slice(0 , 1)).toString();
                  }
                  if (r.last_name !== null && r.last_name !== '') {
                    deepString += (r.last_name.slice(0 , 1)).toString();
                  }
                })
              } else if ( key === 'attachments') {
                // label, attachment and description
                e[key].forEach((a) => {
                  if (a.label !== null && a.label !== '') {
                    deepString += (a.label).toString();
                  }
                  if (a.attachment !== null && a.attachment !== '') {
                    deepString += (a.attachment).toString();
                  }
                  if (a.description !== null && a.description !== '') {
                    deepString += (a.description).toString();
                  }
                })
              } else {
                e[key] !== null ? deepString += (e[key]).toString() : deepString += '';
              }
            }
          }
          deepString = deepString.toLowerCase();
          // search
          let result = false;
          const indexes: Array<number> = [];
          if (deepString !== '') {
            if (this.FRONT_SAMPLE_STRIECT_FILTER) {
              result = deepString.indexOf(userInput) !== -1 ? true : false;
            } else {
              userInputArray.forEach((c: string) => {
                const mIndex = deepString.indexOf(c);
                indexes.push(mIndex);
                if (mIndex !== -1) {
                  const tempString = deepString
                  deepString = tempString.substring(0, mIndex)
                                + (mIndex === tempString.length - 1 ? '' :  tempString.substring(mIndex + 1));
                }
              })
              result = indexes.indexOf(-1) !== -1 ? false : true;
            }
          }
          return result;
        });
      }
      // for box searched samples
      const matchedBoxSamples = this.searchedSamples.filter((s: Sample | CSample) => s.occupied === true);
       matchedBoxSamples.forEach((s: Sample | CSample) => this.searchedBoxSamples.push(s.position));
    }
    this.loading = false;
  }
  // filter output
  updateSampleList(sampleFilter: SampleFilter) {
    this.loading = true;
    // empty all the arrays
    this.selectedCells = [];
    this.selectedSamples = [];
    // restore the complete samples for list view
    // hard copy of the array
    this.searchedSamples = this.samples.filter((e) => e.pk != null);
    // empty searched samples for box view
    this.searchedBoxSamples = [];
    // filter the machted boxes
    if (sampleFilter.value != null) {
        this.searchedSamples = this.samples.filter((e) => {
        if (sampleFilter.key === 'label') {
          // get the attachment label
          if (e.attachments != null && e.attachments.length > 0) {
            let attachments: Array<Attachment> = [];
            attachments = e.attachments.filter((a: Attachment) => a.label.toLowerCase().indexOf(sampleFilter.value.toLowerCase()) !== -1);
            if (attachments != null && attachments.length > 0) {
              return true; }
          }
        } else if (sampleFilter.key === 'quantity') {
          if (e.quantity === +sampleFilter.value) {
            return true; }
        } else {
          if (e[sampleFilter.key] == null) {
            return false;
          } else {
            if (e[sampleFilter.key].toLowerCase().indexOf(sampleFilter.value.toLowerCase()) !== -1) { return true; }
          }
        }
        return false;
      });
      // for box searched samples
      const matchedBoxSamples = this.searchedSamples.filter((s: Sample | CSample) => s.occupied === true);
       matchedBoxSamples.forEach((s: Sample | CSample) => this.searchedBoxSamples.push(s.position));
    };
    this.loading = false;
  }

  // capture emit from sample-table
  captureSampleSelected(pks: Array<number>) {
    this.selectedSamples = pks;
  }

  captureCellSelected(cells: Array<string>) {
    this.selectedCells = cells;
  }

  captureDbClickedSample(pk: number) {
    let sample;
    const samples_matched = this.searchedSamples.filter(s => s.pk === pk);
    if (samples_matched !== null && samples_matched.length > 0) {
      sample = samples_matched[0];
      // activate the model
      this.dbClickedSamplePK = sample.pk;
    } else {
      this.dbClickedSamplePK = -1;
    }
    this.DbClickCount++;
    // this.DbClickCount.emit(this.count);
  }

  ngOnInit() {
    this.sub = this.route.params
      .mergeMap(params => {
        this.ct_pk = +params['ct_pk'];
        this.box_pos = params['box_pos'];
        this.querySub = this.route.queryParams
        return this.querySub;
      })
      .mergeMap((params) => {
        if (params && params['second_container'] !== undefined && params['second_box_position'] !== undefined) {
          // find only one box
          // redirection
          this.router.navigate(['/containers', this.ct_pk, this.box_pos, 'move_samples'],
          { queryParams: { 'second_container': params['second_container'], 'second_box_position': params['second_box_position'] } });
          return Observable.of(this.container);
        } else {
          if (this.container != null) {
            return Observable.of(this.container);
          } else {
            return this.containerService.containerDetail(this.ct_pk)
          }
        }
      })
      .mergeMap((container: any) => {
        // set the container
        this.container = container;
        if (this.box != null && this.box.samples !== undefined && this.box.samples.length > 0) {
            return Observable.of(this.box);
        } else {
          // get group boxes of the container
          return this.containerService.getContainerBox(this.ct_pk, this.box_pos); }
      })
      .subscribe((box: Box) => {
        this.box = box;
        // get samples
        if (this.USE_CSAMPLE) {
          this.samples = this.box.csamples
          .sort(this.utilityService.sortArrayByMultipleProperty('vposition', 'hposition'))
          .sort(this.utilityService.sortArrayBySingleProperty('-occupied'));
        } else {
          this.samples = this.box.samples
          .sort(this.utilityService.sortArrayByMultipleProperty('vposition', 'hposition'))
          .sort(this.utilityService.sortArrayBySingleProperty('-occupied'));
        }
        this.searchedSamples = this.samples;
        this.loading = false;
      },
      () => this.alertService.error('Something went wrong, fail to load the box from the server!', true));
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

}
