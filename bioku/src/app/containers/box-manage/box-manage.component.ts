import { Component, OnInit, Inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Container } from '../../_classes/Container';
import { Box } from '../../_classes/Box';
import { User } from '../../_classes/User';
import { Sample } from '../../_classes/Sample';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { AppStore } from '../../_providers/ReduxProviders';
import {  ContainerService } from '../../_services/ContainerService';
import {  UtilityService } from '../../_services/UtilityService';
import { Group } from '../../_classes/Group';
import { identifierModuleUrl } from '@angular/compiler';


@Component({
  selector: 'app-box-manage',
  templateUrl: './box-manage.component.html',
  styleUrls: ['./box-manage.component.css']
})
export class BoxManageComponent implements OnInit, OnDestroy {

  loading: Boolean = true;
  // route param
  ct_pk: number;
  box_pos: string;
  private sub: any; // subscribe to params observable
  private querySub: any;
  container: Container = null;
  box: Box = null;
  samples: Array<Sample> = [];
  color = '#ffffff';
  box_horizontal: number;
  hArray: Array<number> = new Array<number>();
  bhArray: Array<number> = new Array<number>();
  box_vertical: string;
  vArray: Array<string> = new Array<string>();
  bvArray: Array<string> = new Array<string>();
  // previous layout
  pre_box_horizontal: number;
  pre_box_vertical: string;
  @ViewChild('verticalCtl') vposition: ElementRef;
  @ViewChild('horizontalCtl') hposition: ElementRef;
  appUrl: string;
  // show user defined box label?
  show_user_defined_label: Boolean = false;
  // allow change the box layout
  allow_change_box_layout: Boolean = false;
  // ignore history sample
  ignore_history_sample = false;
  // auth user
  user: User;
  // box owner
  box_owner: User = new User();
  // all group users
  group_all_users: Array<User> = new Array<User>();
  // is able to change the box owner
  is_able_2_update_owner = false;
  // is PI of assistant
  is_PI_or_assist = false;
  // delete box clicked
  delete_box_clicked = false;
  constructor(private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
              private router: Router, private containerService: ContainerService, private alertService: AlertService,
              private utilityService: UtilityService) {
      // subscribe store state changes
      appStore.subscribe(() => this.updateState());
      this.updateState();
      // SET THE DEFAULT BOX LAYOUT
      this.box_horizontal = this.appSetting.BOX_HORIZONTAL;
      this.box_vertical = this.appSetting.BOX_POSITION_LETTERS[this.appSetting.BOX_VERTICAL - 1]; // a letter
      this.hArray = this.utilityService.genArray(this.box_horizontal);
      this.vArray = this.appSetting.BOX_POSITION_LETTERS.slice(0, this.appSetting.BOX_POSITION_LETTERS.indexOf(this.box_vertical) + 1 );
      this.appUrl = this.appSetting.URL;
      this.show_user_defined_label = this.appSetting.SHOW_BOX_LABEL;
      this.ignore_history_sample = this.appSetting.IGNORE_HISTORY_SAMPLE;
    }
    updateState() {
      const state = this.appStore.getState();
      if (state.containerInfo && state.containerInfo.currentContainer) {
        this.container = state.containerInfo.currentContainer;
      }
      if (state.containerInfo && state.containerInfo.currentBox) {
        this.box = state.containerInfo.currentBox;
      }
      if (state.authInfo != null && state.authInfo.authUser != null) {
        this.user = state.authInfo.authUser;
        this.box_owner = this.user;
      }
      if (state.authInfo !== null && state.authInfo.authGroup !==  null ) {
        // get all the users
        state.authInfo.authGroup.forEach((g: Group): void => {
          if (g.members !== null && g.members.length > 0) {
            g.members.forEach(m => {
              this.group_all_users.push(m.user);
            });
          }
        });
        // check the primary group
        this.is_PI_or_assist = this.isPIorAssist(state.authInfo.authGroup[0]);
      }
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
        if (this.container != null && this.container.pk === this.ct_pk) {
          return Observable.of(this.container);
        } else {
          return this.containerService.containerDetail(this.ct_pk)
        }
      })
      .mergeMap((container: any) => {
        // set the container
        this.container = container;
        if (this.box != null && this.box.box_position === this.box_pos
          && this.box.samples !== undefined && this.box.samples.length > 0) {
            return Observable.of(this.box);
        } else {
          // get group boxes of the container
          return this.containerService.getContainerBox(this.ct_pk, this.box_pos); }
      })
      .subscribe((box: Box) => {
        this.box = box;
        if (this.box != null) {
          // get samples
          this.samples = this.box.samples === undefined 
          ? new Array<Sample>()
          : this.box.samples
            .sort(this.utilityService.sortArrayByMultipleProperty('vposition', 'hposition'))
            .sort(this.utilityService.sortArrayBySingleProperty('-occupied'));
          this.color = this.box.color == null ? '#ffffff' : this.box.color;
          this.bhArray = this.utilityService.genArray(this.box.box_horizontal);
          this.bvArray = this.appSetting.BOX_POSITION_LETTERS.slice(0, this.box.box_vertical);
          this.box_horizontal = (this.box != null && this.box.box_horizontal !== null )
            ? this.box.box_horizontal
            : this.box_horizontal;
        this.box_vertical = (this.box != null && this.box.box_vertical !== null)
            ? this.appSetting.BOX_POSITION_LETTERS[this.box.box_vertical - 1]
            : this.box_vertical;
        // update box layout
        this.hArray = this.utilityService.genArray(this.box_horizontal);
        this.vArray = this.appSetting.BOX_POSITION_LETTERS.slice(0, this.appSetting.BOX_POSITION_LETTERS.indexOf(this.box_vertical) + 1 );
        // set orignal layout
        this.pre_box_horizontal = this.box_horizontal;
        this.pre_box_vertical = this.box_vertical;

        // box owner
        this.box_owner =
        this.box.researchers != null && this.box.researchers.length > 0
        ? this. box.researchers[0]
        : this.user;
        if (this.is_PI_or_assist || this.user.pk === this.box_owner.pk) {
          this.is_able_2_update_owner = true;
        }
        }
        // toggle loading
        this.loading = false;
      },
      () => this.alertService.error('Something went wrong, fail to load the box from the server!', true));

    // // allow change the box layout
    if (this.appSetting.ALLOW_MULTIPLE_BOX_DIMENSION === true) {
      this.allow_change_box_layout = true;
    } else {
      this.allow_change_box_layout = false;
    }
  }
  // generate extra options for dropdown
  genVerticalOptions() {
    return [...this.vArray, ...this.appSetting.BOX_POSITION_LETTERS.slice(this.vArray.length,
            this.vArray.length + this.appSetting.BOX_EXTRA_LAYOYT)];
  }
  genHorizontalOptions() {
    return this.utilityService.genArray(this.hArray.length + this.appSetting.BOX_EXTRA_LAYOYT);
  }
  // update the box layout
  updateLayout(event: any, type: string, ) {
    // event is the value of changes
    if (type === 'horizontal') {
      this.box_horizontal = +event;
      // validate new layout ////////////////////////////////////////
      const is_valid = this.validateNewLayout(this.box_horizontal, this.box_vertical, this.samples, this.ignore_history_sample);
      if (!is_valid) {
        this.box_horizontal = this.pre_box_horizontal;
        this.hposition.nativeElement.value = (this.box_horizontal - 1) + ': ' + this.box_horizontal;
        this.alertService.error('Invalid layout: the new layout must include all the samples!', false);
      } else {
        this.pre_box_horizontal = this.box_horizontal;
      }
      this.hArray = this.utilityService.genArray(this.box_horizontal);
      this.bhArray = this.utilityService.genArray(this.box_horizontal);
    }
    if (type === 'vertical') {
      this.box_vertical = event;
      // validate new layout ////////////////////////////////////////////////
      const is_valid = this.validateNewLayout(this.box_horizontal, this.box_vertical, this.samples, this.ignore_history_sample);
      if (!is_valid) {
        this.box_vertical = this.pre_box_vertical;
        this.vposition.nativeElement.value = this.appSetting.BOX_POSITION_LETTERS.indexOf(this.box_vertical) + ': ' + this.box_vertical
        this.alertService.error('Invalid layout: the new layout must include all the samples!', false);
      } else {
        this.pre_box_vertical = this.box_vertical;
      }
      this.vArray = this.appSetting.BOX_POSITION_LETTERS.slice(0, this.appSetting.BOX_POSITION_LETTERS.indexOf(this.box_vertical) + 1 );
      this.bvArray = this.appSetting.BOX_POSITION_LETTERS.slice(0, this.appSetting.BOX_POSITION_LETTERS.indexOf(this.box_vertical) + 1 );
    }
  }
  pickerSamples(h: number, v: string): Array<Sample> {
    return (this.samples != null
      ? this.samples.filter((s: Sample) => s.occupied === true && s.position.toLowerCase() === (v + h).toLowerCase())
      : new Array<Sample>());
  }
  genBackgroundColor(color: string) {
    // tslint:disable-next-line:no-inferrable-types
    let cssValue: string = '';
    if (color != null) {
      cssValue = color;
    }
    return cssValue;
  }
  // validate the new box layout
  validateNewLayout(box_horizontal: number, box_vertical: string, samples: Array<Sample>, ignore_history_sample: boolean) {
   let is_valid = false;
   const sample: Sample = samples.find((s: Sample, i: number): boolean => {
    return (
      (s.hposition > box_horizontal || s.vposition > box_vertical)
      && (!ignore_history_sample ? s.occupied === true : true)
      );
   });
   is_valid = sample === undefined ? true : false;
   return is_valid;
  }
  // update box owner
  updateOwner(event: any) {
    this.box_owner = this.group_all_users.find((o: User) => {return o.pk === event}) ;
  }
  // check permissions
  isPIofGroup(group: Group): boolean {
    let isPI = false;
    if (this.user && this.user.email === group.email) {
      isPI = true;
    }
    return isPI;
  }

  isAssistofGroup(group: Group): boolean {
    let isAssist = false;
    if (group !== undefined && group.assistants !== undefined && group.assistants ) {
      group.assistants.forEach( assist => {
        if (assist.user.pk === this.user.pk) {
          isAssist = true; }
      })
    }
    return isAssist;
  }

  // check user isPIor Assist
  isPIorAssist(group: Group): boolean {
    let isPIorAssist = false;
    isPIorAssist = this.isPIofGroup(group) || this.isAssistofGroup(group) ? true : false;
    return isPIorAssist;
  }
  // save box: save layout and save owner
  save_box() {
    if (this.is_able_2_update_owner) {
      // owner name
      const owner_name = this.box_owner.first_name.toUpperCase() + ' ' + this.box_owner.last_name.toUpperCase();
      // box vertical conversion
      const box_vertical_number = this.appSetting.BOX_POSITION_LETTERS.indexOf(this.box_vertical) + 1;
      // save the dimension
      this.containerService
      .updateBoxDimension(this.container.pk, this.box.box_position, box_vertical_number, this.box_horizontal)
      .mergeMap(() => {
        // also save new owner
        return this.containerService.updateBoxOwner(this.container.pk, this.box.box_position, this.box_owner.pk)
      })
      .subscribe(
        () => {this.alertService.success('box dimension saved and box assigned to ' + owner_name + '!', false); },
        (err) => {this.alertService.error('Something went wrong, not all data were saved!', false); });
    } else {
      // save the dimension only
      const box_vertical_number = this.appSetting.BOX_POSITION_LETTERS.indexOf(this.box_vertical) + 1;
      this.containerService.updateBoxDimension(this.container.pk, this.box.box_position, box_vertical_number, this.box_horizontal)
      .subscribe(() => {this.alertService.success('box dimenstion saved!', false); },
                (err) => {this.alertService.error('Something went wrong, box dimenstion NOT saved!', false); });
    }
  }
  // inital remove box
  delete_box() {
    this.delete_box_clicked = true;
  }
  cancel_deletion() {
    this.delete_box_clicked = false;
  }
  confirm_delete_box() {
    // delete box
    this.containerService.removeBox(this.container.pk, this.box.box_position)
    .subscribe(
      () => {
      this.alertService.success('box deleted!', true);
      this.router.navigate(['/containers/overview/', this.container.pk]);
    },
    (err) => {
      this.alertService.error('Something went wrong, box not deleted!', false);
    });
  }
  ngOnDestroy() { this.sub.unsubscribe(); }
}
