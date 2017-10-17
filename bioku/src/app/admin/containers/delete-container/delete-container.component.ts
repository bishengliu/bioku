import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../_services/AlertService';
import { AppSetting} from '../../../_config/AppSetting';
import { APP_CONFIG } from '../../../_providers/AppSettingProvider';
import { LogAppStateService } from '../../../_services/LogAppStateService';

import { ContainerService } from '../../../_services/ContainerService';
import { User } from '../../../_classes/User';
import { Container } from '../../../_classes/Container';

// redux
import { AppStore } from '../../../_providers/ReduxProviders';
import { AppState , AppPartialState} from '../../../_redux/root/state';

@Component({
  selector: 'app-delete-container',
  templateUrl: './delete-container.component.html',
  styleUrls: ['./delete-container.component.css']
})
export class DeleteContainerComponent implements OnInit, OnDestroy {
  // route param
  id: number;
  private sub: any; // subscribe to params observable

  container: Container = null;
  appUrl: string;
  // get current route url
  url: String = '';
  constructor(private alertService: AlertService, private route: ActivatedRoute,
              @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore,
              private router: Router, private logAppStateService: LogAppStateService, private containerService: ContainerService) { 
    this.appUrl = this.appSetting.URL;
  }

  deleteContainer(pk: number): void {
   // put call
    this.containerService.containerDelete(pk)
    .subscribe(
      data => {
        this.alertService.success('Container deleted!', true);
        // naviagate to home
        if (this.url.startsWith('/containers/delete')) {
          this.router.navigate(['/containers']);
        } else {
          this.router.navigate(['/admin/containers/']); }
      },
      () => {
        this.alertService.error('Something went wrong, the container was not deleted!', true);
        // naviagate to home
        if (this.url.startsWith('/containers/delete')) {
          this.router.navigate(['/containers']);
        } else {
          this.router.navigate(['/admin/containers/']); }
      });
  }
  cancelDeletion(): void {
    // naviagate to home
    if (this.url.startsWith('/containers/delete')) {
      this.router.navigate(['/containers']);
    } else {
      this.router.navigate(['/admin/containers/']);}
  }

  ngOnInit() {
    this.sub = this.route.params
    .mergeMap((params) => {
      this.id = +params['id'];
      return this.containerService.containerDetail(this.id);
    })
    .subscribe(
        data => { this.container = data; },
        () => {this.alertService.error('Something went wrong, data were not loaded from the server!', true)}
    );
    // get current url
    this.url = this.router.url;
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
