import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../_services/AlertService';
import { GroupService } from '../../../_services/GroupService';
import { User } from '../../../_classes/User';
import { Group } from '../../../_classes/Group';
import { AppSetting} from '../../../_config/AppSetting';
import { APP_CONFIG } from '../../../_providers/AppSettingProvider';
import { LogAppStateService } from '../../../_services/LogAppStateService';

// redux
import { AppStore } from '../../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../../_redux/root/state';

@Component({
  selector: 'app-delete-group',
  templateUrl: './delete-group.component.html',
  styleUrls: ['./delete-group.component.css']
})
export class DeleteGroupComponent implements OnInit, OnDestroy {
  // route param
  id: number;
  private sub: any; // subscribe to params observable
  // auth user
  group: Group = null;
  appUrl: string;
  constructor(private alertService: AlertService, private route: ActivatedRoute, @Inject(APP_CONFIG) private appSetting: any,
              @Inject(AppStore) private appStore, private router: Router, private logAppStateService: LogAppStateService,
              private groupService: GroupService) {
    this.appUrl = this.appSetting.URL;
  }
  deleteGroup(pk: number): void {
   // put call
   // console.log(pk);
    this.groupService.groupDelete(pk)
    .subscribe(
      data => {
        this.alertService.success('Group deleted!', true);
        // naviagate to home
        this.router.navigate(['/admin/groups']); },
      () => {
        this.alertService.error('Something went wrong, the group was not deleted!', true);
        // naviagate to home
        this.router.navigate(['/admin/groups']); }
    );
  }
  ngOnInit() {
    this.sub = this.route.params
    .mergeMap((params) => {
      this.id = +params['id'];
      return this.groupService.groupDetail(this.id);
    }).subscribe(
        data => { this.group = data; },
        () => this.alertService.error('Something went wrong, data were not loaded from the server!', true)
       );
  }
  ngOnDestroy() { this.sub.unsubscribe(); }
}
