import { Component, OnInit, Inject } from '@angular/core';
import { SampleSearch, Sample, Attachment } from '../../_classes/Sample';
import {  ContainerService } from '../../_services/ContainerService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { User } from '../../_classes/User';
import {  UtilityService } from '../../_services/UtilityService';
// ng2-sticky
// import { Ng2StickyModule } from 'ng2-sticky';

@Component({
  selector: 'app-sample-search',
  templateUrl: './sample-search.component.html',
  styleUrls: ['./sample-search.component.css']
})
export class SampleSearchComponent implements OnInit {
  searchObj: SampleSearch = null;
  samples: Array<Sample> = new Array<Sample>();
  searchedSamples: Array<Sample> = new Array<Sample>();
  searching: Boolean = false;
  searched: Boolean = false;
  show_error: Boolean = false;
  // search again
  toogleSearch: Boolean = false;
  searchAgain: Boolean = false;
  // clicked and selected samples
  selectedSamplePks: Array<number> = [];
  selectedSamples: Array<Sample> = new Array<Sample>();
  dbClickedSamplePK = -1; // for dbclick
  DbClickCount = 0;
  FRONT_SAMPLE_STRIECT_FILTER = false;
  ALLOW_DOWNLOAD_EXPORT = true;
  constructor(private containerService: ContainerService, @Inject(APP_CONFIG) private appSetting: any,
              private utilityService: UtilityService) {
    this.FRONT_SAMPLE_STRIECT_FILTER = this.appSetting.FRONT_SAMPLE_STRIECT_FILTER;
    this.ALLOW_DOWNLOAD_EXPORT = this.appSetting.ALLOW_DOWNLOAD_EXPORT;
   }

ngOnInit() {}

captureSearchObj(obj: SampleSearch) {
  this.searchObj = obj;
  this.samples = null;
  this.searching = true;
  this.show_error = false;
  this.containerService.SearchSample(this.searchObj)
      .subscribe(
        (samples: Array<Sample>) => {
          // console.log(samples); // sample found ...
          this.samples = [...samples];
          this.searchedSamples = [...samples];
          this.searching = false;
          this.toogleSearch = true;
          this.searched = true;
        },
        (err) => {
          console.log(err);
          this.searching = false;
          this.show_error = true;
          this.toogleSearch = true;
          this.searched = false;
        }
      );
}

captureSampleSelected(pks: Array<number>) {
  this.selectedSamplePks = [...pks];
  this.selectedSamples = this.getSampleSelected(this.selectedSamplePks, this.samples);
}
// get selected samples
getSampleSelected(pks: Array<number>, samples: Array<Sample>): Array<Sample> {
  const SelectedSamples: Array<Sample> = new Array<Sample>();
  if (samples.length > 0 && pks.length > 0) {
    return samples.filter((s, i) => {
      return pks.indexOf(s.pk) !== -1;
    })
  } else {
    return SelectedSamples;
  }
}
captureDbClickedSample(pk: number) {
  let sample: Sample = new Sample();
  const samples_matched = this.samples.filter(s => s.pk === pk);
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
showAgain() {
    this.samples = [];
    this.searchedSamples = [];
    this.searchAgain = !this.searchAgain;
    this.show_error = false;
    this.searching = false;
    this.searched = false;
  }
  updateDeepFilteredSampleList(userInput: string) {
    userInput = userInput.toString().toLowerCase();
    // empty all the arrays
    this.selectedSamples = [];
    // restore the complete samples for list view
    // hard copy of the array
    this.searchedSamples = this.samples.filter((e: Sample) => e.pk != null);
    // empty searched samples for box view
    // filter the machted boxes
    if (userInput !== null && userInput !== '') {
      // split userinput into an array
      const userInputArray = userInput.split('');
      if (userInputArray.length > 0) {
        // loop to the box sample and concat all the text into a string
        this.searchedSamples = this.samples.filter((e: Sample) => {
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
                e[key].forEach((a: Attachment ) => {
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
    }
  }
}
