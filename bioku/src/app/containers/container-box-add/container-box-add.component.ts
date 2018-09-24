import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { FormBuilder, AbstractControl, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { User } from '../../_classes/User';
import { Box } from '../../_classes/Box';
import { AddBox } from '../../_classes/AddBox';
import { Container } from '../../_classes/Container';
import { ContainerTower, Containershelf, BoxAvailability } from '../../_classes/ContainerTower';
import {  ContainerService } from '../../_services/ContainerService';
import { LocalStorageService } from '../../_services/LocalStorageService';
import { UtilityService } from '../../_services/UtilityService';
import { AlertService } from '../../_services/AlertService';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';

@Component({
  selector: 'app-container-box-add',
  templateUrl: './container-box-add.component.html',
  styleUrls: ['./container-box-add.component.css']
})
export class ContainerBoxAddComponent implements OnInit, OnDestroy {
  // auth user
  user: User = null;
  token: string = null;
  // route param
  id: number;
  private sub: any; // subscribe to params observable
  // CURRENT CONTAINER
  container: Container;
  boxes: Array<BoxAvailability> = new Array<BoxAvailability>();
  add_boxes: Array<AddBox> = new Array<AddBox>();
  box_horizontal: number;
  hArray: Array<number> = new Array<number>();
  box_vertical: string;
  vArray: Array<string> = new Array<string>();
  // allow change the box layout
  allow_change_box_layout: Boolean = false;
  // add box
  adding: Boolean = false;
  constructor(private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any,
              @Inject(AppStore) private appStore, private utilityService: UtilityService,
              private router: Router, private http: Http, private containerService: ContainerService,
              private localStorageService: LocalStorageService, private alertService: AlertService) {
    appStore.subscribe(() => this.updateState());
    this.updateState();
    // SET THE DEFAULT BOX LAYOUT
    this.box_horizontal = this.appSetting.BOX_HORIZONTAL;
    this.box_vertical = this.appSetting.BOX_POSITION_LETTERS[this.appSetting.BOX_VERTICAL - 1]; // a letter
  }

  updateState() {
    const state = this.appStore.getState();
    // set auth user
    if (state.authInfo.authUser != null && state.authInfo.token != null) {
      this.user = state.authInfo.authUser;
      this.token = state.authInfo.token.token;
    }
    // get current container
    if (state.containerInfo && state.containerInfo.currentContainer) {
      this.container = state.containerInfo.currentContainer;
    }
  }

  ngOnInit() {
    this.sub = this.route.params
    .mergeMap((params) => {
      this.id = +params['id'];
      if ( this.container != null && this.container.pk === this.id) {
        return Observable.of(this.container);
      } else {
        return this.containerService.containerDetail(this.id); }
    });
    // container and boxes observable
    this.sub.subscribe(
      (container: Container) => { this.container = container; },
      (err) => { console.log(err) }
    );
    // get the passed boxes
    // console.log(this.localStorageService);
    if (this.localStorageService.selectedEmptySlots == null) {
      this.router.navigate(['/containers/overview/', this.container.pk ]);
    } else {
      this.boxes = this.localStorageService.selectedEmptySlots.sort(this.utilityService.sortArrayBySingleProperty('full_position'));
    }
    // generate add_boxes
    if (this.boxes.length > 0) {
      this.boxes.forEach((ab, i) => {
        const add_box: AddBox = new AddBox();
        add_box.box_full_position = ab.full_position;
        add_box.is_excluded = false;
        this.add_boxes.push(add_box);
      });
    }
    // get the first box
    this.box_horizontal = (this.container.first_box != null && this.container.has_box)
                          ? this.container.first_box.box_horizontal : this.box_horizontal;
    this.box_vertical = (this.container.first_box != null && this.container.has_box)
                          ? this.appSetting.BOX_POSITION_LETTERS[this.container.first_box.box_vertical - 1]
                          : this.box_vertical;
    // update box layout
    this.hArray = this.utilityService.genArray(this.box_horizontal);
    this.vArray = this.appSetting.BOX_POSITION_LETTERS.slice(0, this.appSetting.BOX_POSITION_LETTERS.indexOf(this.box_vertical) + 1 );

    // allow change box layout ?
    if (this.container.has_box === false) {
      this.allow_change_box_layout = true;
    } else if(this.appSetting.ALLOW_MULTIPLE_BOX_DIMENSION === true) {
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

  toggleBox(box_full_position: string, bindex: number): void {
    if (this.add_boxes[bindex].box_full_position === box_full_position) {
      this.add_boxes[bindex].is_excluded = !this.add_boxes[bindex].is_excluded;
    }
  }

  updateLayout(event: any, type: string, ) {
    // event is the value of changes
    if (type === 'horizontal') {
      this.box_horizontal = +event;
      this.hArray = this.utilityService.genArray(this.box_horizontal);

    }
    if (type === 'vertical') {
      this.box_vertical = event;
      this.vArray = this.appSetting.BOX_POSITION_LETTERS.slice(0, this.appSetting.BOX_POSITION_LETTERS.indexOf(this.box_vertical) + 1 );
    }
  }

  save_add_box() {
    this.adding = true;
    // console.log(this.add_boxes);
    const boxes  = this.filterAddBoxes(this.add_boxes);
    if (boxes.length === 0) {
      this.localStorageService.boxAvailabilities = [];
      this.localStorageService.lastSelectedOccupiedBox = null;
      this.localStorageService.selectedEmptySlots = [];
      this.localStorageService.selectedOccupiedSlots = [];
      // tslint:disable-next-line:quotemark
      this.alertService.error("Nothing to add, please make sure you've selected at least one slot to add!", true);
      this.adding = false;
      this.router.navigate(['/containers', this.container.pk]);
    } else {
      // tslint:disable-next-line:no-inferrable-types
      let failed_boxes: string = '';
      // tslint:disable-next-line:no-inferrable-types
      let count: number = 0;
      boxes.forEach((box, i) => {
        count++;
        this.containerService.addContainerBox(this.container.pk,
          box.box_full_position, this.box_horizontal, this.appSetting.BOX_POSITION_LETTERS.indexOf(this.box_vertical) + 1)
        .subscribe(() => {
          if (count === boxes.length) {
            // after saving
            this.localStorageService.boxAvailabilities = [];
            this.localStorageService.lastSelectedOccupiedBox = null;
            this.localStorageService.selectedEmptySlots = [];
            this.localStorageService.selectedOccupiedSlots = [];
            this.alertService.success('All boxes are added successfully!', true);
            this.adding = false;
            this.router.navigate(['/containers', this.container.pk]);
          }
        },
        (err) => {
          failed_boxes += box.box_full_position + ' ';
          if (count === boxes.length) {
            // after saving
            this.localStorageService.boxAvailabilities = [];
            this.localStorageService.lastSelectedOccupiedBox = null;
            this.localStorageService.selectedEmptySlots = [];
            this.localStorageService.selectedOccupiedSlots = [];
            this.alertService.error('Something went wrong, failed to add boxes: ' + failed_boxes + '!', true);
            this.adding = false;
            this.router.navigate(['/containers', this.container.pk]);
          }
          console.log(err);
        });
      });
    }
  }

  filterAddBoxes(add_boxes: Array<AddBox>) {
    return add_boxes.filter((ab, i) => {
      return ab.is_excluded !== true;
    });
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
