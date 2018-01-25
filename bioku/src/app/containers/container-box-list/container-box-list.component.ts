import { Component, OnInit, Inject, OnDestroy, } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../_services/AlertService';
import { AppSetting} from '../../_config/AppSetting';
import { APP_CONFIG } from '../../_providers/AppSettingProvider';
import { Container } from '../../_classes/Container';
import { Box, BoxFilter } from '../../_classes/Box';
import { ContainerService } from '../../_services/ContainerService';
import { LogAppStateService } from '../../_services/LogAppStateService';
import { UtilityService } from '../../_services/UtilityService';
import { RefreshService } from '../../_services/RefreshService';
// redux
import { AppStore } from '../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../_redux/root/state';
import { SetCurrentBoxAction, setCurrentBoxActionCreator, setCurrentBoxActionAsync,
  SetCurrentContainerAction, setCurrentContainerActionCreator } from '../../_redux/container/container_actions';
@Component({
  selector: 'app-container-box-list',
  templateUrl: './container-box-list.component.html',
  styleUrls: ['./container-box-list.component.css']
})
export class ContainerBoxListComponent implements OnInit, OnDestroy {
  loading = true;
  load_failed = false;
  // route param
  id: number;
  private sub: any; // subscribe to params observable
  private querySub: any;
  containers: Array<Container> = new Array<Container>();
  container: Container = null;
  currentBox: Box = null;
  myBoxes: Array<Box> = [];
  searchedBoxes: Array<Box> = [];
  show_all = false;
  all_boxes_loaded = false;
  max_box_cardview_switch = 1;
  // allow uploading samples to container
  allowUpload2Container = false;
  constructor(private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
              private utilityService: UtilityService, private router: Router, private containerService: ContainerService,
              private alertService: AlertService, private logAppStateService: LogAppStateService,
              private refreshService: RefreshService, ) {
    this.allowUpload2Container = this.appSetting.ALLOW_UPLOAD_SAMPLES_2_CONTAINER;
    this.max_box_cardview_switch = this.appSetting.BOX_FULNESS_PROGRESS_VIEW;
    // subscribe store state changes
    appStore.subscribe(() => this.updateState());
    this.updateState();
  }

  updateState() {
    const state = this.appStore.getState();
    if (state.containerInfo && state.containerInfo.containers) {
      this.containers = state.containerInfo.containers;
    }
    if (state.containerInfo && state.containerInfo.currentContainer) {
      this.container = state.containerInfo.currentContainer;
    }
    if (state.containerInfo && state.containerInfo.currentBox) {
      this.currentBox = state.containerInfo.currentBox;
    }
  }

  updateBoxList(boxFilter: BoxFilter) {
    this.loading = true;
    // restore the complete boxes
    this.searchedBoxes = this.myBoxes;
    // filter the machted boxes
    this.searchedBoxes = this.myBoxes.filter((e: Box) => {
        let isSelected = true;
        if (+boxFilter.tower !== -1 && e.tower !== +boxFilter.tower) {
          isSelected = false;
        }
        if (+boxFilter.shelf !== -1 && e.shelf !== +boxFilter.shelf) {
          isSelected = false;
        }
        if (+boxFilter.box !== -1 && e.box !== +boxFilter.box) {
          isSelected = false;
        }
        return isSelected;
      });
      this.loading = false;
  }

  displaySelectedBox(box: Box): void {
    // dispatch the selected box
    const setCurrentBoxAction: SetCurrentBoxAction = setCurrentBoxActionCreator(this.container, box);
    this.appStore.dispatch(setCurrentBoxAction);
    // dump the selected box
    this.refreshService.dumpContainerState(this.appStore.getState().containerInfo);
    this.router.navigate(['/containers', this.container.pk, box.box_position]);
  }

  ngOnInit() {
    this.sub = this.route.params
      .mergeMap((params) => {
        this.load_failed = false;
        this.loading = true;
        this.id = +params['id'];
        if (this.container != null) {
          return Observable.of(this.container);
        } else {
          return this.containerService.containerDetail(this.id)
        }
      })
      .mergeMap((container: any) => {
        this.container = container;
        this.querySub = this.route.queryParams
        return this.querySub;
      })
      .mergeMap((params) => {
        if (params && params['box_position'] !== undefined) {
          // find only one box
          return this.containerService.getContainerBox(this.container.pk, params['box_position']);
        } else {
          // get group favotite boxes of the container
          return this.containerService.containerGroupFavoriteBoxes(this.id); }
      })
      .subscribe((data: any) => {
        if (Array.isArray(data)) {
          // if it array, then is the inital loading
          this.myBoxes = data.sort(this.utilityService.sortArrayByMultipleProperty('-rate', 'box_position'));
          // this.searchedBoxes = this.myBoxes;
          if (this.show_all) {
            // show all
            this.searchedBoxes = this.myBoxes.sort(this.utilityService.sortArrayByMultipleProperty('-rate', 'box_position'));
          } else {
            this.searchedBoxes = this.myBoxes.filter((box, i) => {
              return box.rate != null; });
          };
        } else {
          // is not an array, force jumping to the box
          this.displaySelectedBox(<Box>data); }
          this.loading = false;
      },
      (err) => {
        console.log(err);
        this.loading = false;
        this.load_failed = true;
        this.alertService.error('Something went wrong, fail to load boxes from the server!', true);
       }
    );
  }

  toggleBoxShow() {
    this.loading = true;
    this.show_all = !this.show_all;
    if (this.show_all) {
      // show all
      this.loading = true;
      // retrieve all the boxes from the server if not loaded before
      if (this.all_boxes_loaded) {
        this.searchedBoxes = this.myBoxes;
        this.loading = false;
      } else {
        this.containerService.containerGroupBoxes(this.id)
        .subscribe((data: any) => {
          this.myBoxes = data.sort(this.utilityService.sortArrayByMultipleProperty('-rate', 'box_position'));
          this.searchedBoxes = this.myBoxes.sort(this.utilityService.sortArrayByMultipleProperty('-rate', 'box_position'));
          this.loading = false;
          this.all_boxes_loaded = true;
        },
        (err) => {
          this.alertService.error('failed to load all the boxes in the current container', true);
          this.loading = false;
        });
      }
    } else {
      // show favourite
      this.searchedBoxes = this.myBoxes.filter((box, i) => { return box.rate != null; });
      this.loading = false;
    }
  }
  boxCardview(boxCount: number) {
    return ( boxCount > 0 && boxCount <= this.max_box_cardview_switch) ? true : false;
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    if (this.querySub !== undefined) {
      this.querySub.unsubscribe();
    }
  }
}
