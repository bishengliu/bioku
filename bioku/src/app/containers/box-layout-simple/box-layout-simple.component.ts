import { Component, OnInit, Inject, Input } from '@angular/core';
import { AppSetting} from '../../_config/AppSetting';
import {APP_CONFIG} from '../../_providers/AppSettingProvider';
import { Box } from '../../_classes/Box';
import { User } from '../../_classes/User';
import { Container } from '../../_classes/Container';
import { Sample, Attachment } from '../../_classes/Sample';
import { CSample, CAttachment } from '../../_classes/CType';
import {  ContainerService } from '../../_services/ContainerService';
import {  UtilityService } from '../../_services/UtilityService';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState } from '../../_redux/root/state';
@Component({
  selector: 'app-box-layout-simple',
  templateUrl: './box-layout-simple.component.html',
  styleUrls: ['./box-layout-simple.component.css']
})
export class BoxLayoutSimpleComponent implements OnInit {
  @Input() box: Box;
  appUrl: string;
  // Box position letters
  box_letters: Array<string> = [];
  // box hArray and vArray
  hArray: Array<number> = [];
  vArray: Array<string> = [];
  USE_CSAMPLE = true;
  DEFAULT_SAMPLE_COLOR: string = '#61666b';
  constructor(@Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
              private containerService: ContainerService, private utilityService: UtilityService) {
    this.appUrl = this.appSetting.URL;
    this.box_letters = this.appSetting.BOX_POSITION_LETTERS;
    this.USE_CSAMPLE = this.appSetting.USE_CSAMPLE;
    this.DEFAULT_SAMPLE_COLOR = this.appSetting.DEFAULT_SAMPLE_COLOR;
   }
  genLetterArray(num: number): Array<string> {
    return this.box_letters.slice(0, num);
  }
  pickerSamples(h: number, v: string): Array<Sample> | Array<CSample> {
    if(this.USE_CSAMPLE) {
      return (this.box.csamples != null
        ? this.box.csamples.filter((s: CSample) => s.occupied === true && s.position.toLowerCase() === (v + h).toLowerCase())
        : new Array<CSample>());
    } else {
      return (this.box.samples != null
        ? this.box.samples.filter((s: Sample) => s.occupied === true && s.position.toLowerCase() === (v + h).toLowerCase())
        : new Array<Sample>());
    }
  }
  genBackgroundColor(color: string) {
    // tslint:disable-next-line:no-inferrable-types
    let cssValue: string = this.DEFAULT_SAMPLE_COLOR;
    if (color != null) {
      cssValue = color;
    }
    return cssValue;
  }
  ngOnInit() {
    if (this.box != null) {
      this.hArray = this.utilityService.genArray(this.box.box_horizontal);
      this.vArray = this.genLetterArray(this.box.box_vertical);
    }
  }

}
