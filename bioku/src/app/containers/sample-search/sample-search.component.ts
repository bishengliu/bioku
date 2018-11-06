import { Component, OnInit, Inject } from '@angular/core';
import { SampleSearch, Sample, Attachment } from '../../_classes/Sample';
import { ContainerService } from '../../_services/ContainerService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { User } from '../../_classes/User';
import { UtilityService } from '../../_services/UtilityService';
import { CTypeService } from '../../_services/CTypeService';
import { CSample, CAttachment, CTypeAttr, CSampleData, CSampleSubData, CType, CSubAttrData } from '../../_classes/CType';
// ng2-sticky
// import { Ng2StickyModule } from 'ng2-sticky';

@Component({
  selector: 'app-sample-search',
  templateUrl: './sample-search.component.html',
  styleUrls: ['./sample-search.component.css']
})
export class SampleSearchComponent implements OnInit {
  searchObj: any = null;
  samples = []; // Sample or CSample
  searchedSamples: Array<Sample> = new Array<Sample>();
  searching: Boolean = false;
  searched: Boolean = false;
  show_error: Boolean = false;
  // search again
  toogleSearch: Boolean = false;
  searchAgain: Boolean = false;
  // clicked and selected samples
  selectedSamplePks: Array<number> = [];
  selectedSamples = []; // Sample or CSample
  dbClickedSamplePK = -1; // for dbclick
  DbClickCount = 0;
  FRONT_SAMPLE_STRIECT_FILTER = false;
  ALLOW_DOWNLOAD_EXPORT = true;
  USE_CSAMPLE = true;
  constructor(private containerService: ContainerService, @Inject(APP_CONFIG) private appSetting: any,
              private utilityService: UtilityService) {
    this.FRONT_SAMPLE_STRIECT_FILTER = this.appSetting.FRONT_SAMPLE_STRIECT_FILTER;
    this.ALLOW_DOWNLOAD_EXPORT = this.appSetting.ALLOW_DOWNLOAD_EXPORT;
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
   }

ngOnInit() {}

captureSearchObj(obj: any) {
  this.searchObj = obj;
  this.samples = null;
  this.searching = true;
  this.show_error = false;
  this.containerService.SearchSample(this.searchObj)
      .subscribe(
        (samples: Array<any>) => {
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
getSampleSelected(pks: Array<number>, samples: Array<any>): Array<any> {
  const SelectedSamples: Array<any> = new Array<any>();
  if (samples.length > 0 && pks.length > 0) {
    return samples.filter((s, i) => {
      return pks.indexOf(s.pk) !== -1;
    })
  } else {
    return SelectedSamples;
  }
}
captureDbClickedSample(pk: number) {
  let sample: any = this.USE_CSAMPLE ? new CSample() : new Sample();
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
    if (this.samples != null) {
      this.searchedSamples = this.samples.filter((e: Sample | CSample) => e.pk != null);
    }
    // empty searched samples for box view
    // filter the machted boxes
    if (userInput !== null && userInput !== '') {
      // split userinput into an array
      const userInputArray = userInput.split('');
      if (userInputArray.length > 0 && this.samples != null) {
        // loop to the box sample and concat all the text into a string
        this.searchedSamples = this.samples.filter((e) => {
          let deepString = this.utilityService.convertObj2String(e);
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
                  const tempString = deepString;
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
