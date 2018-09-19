import { Injectable , Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertService } from '../_services/AlertService';
import { AppSetting} from '../_config/AppSetting';
import { APP_CONFIG } from '../_providers/AppSettingProvider';
import { AppStore } from '../_providers/ReduxProviders';
import {GroupService} from '../_services/GroupService';
import { Observable } from 'rxjs';

@Injectable()
export class GroupCountGuard implements CanActivate {
    gCount: Number = 0;
    constructor(@Inject(APP_CONFIG) private appSetting: any, private alertService: AlertService, private router: Router,
                @Inject(AppStore) private appStore, private groupService: GroupService) {}

    canActivate(): Observable<boolean> | boolean {
        if (!this.appSetting.APP_USER_VERIFICATION) {
            if (this.appSetting.MAX_G === -1) {
                return true;
            } else {
                return this.groupService.getGroupCount()
                .map((c) => {
                    this.gCount = !isNaN(+c.count) ? c.count : 0;
                    if (this.gCount > this.appSetting.MAX_G) {
                        this.alertService
                        .error('Exceed maximum allowed number of groups for the application, please contact us for support!', true);
                        this.router.navigate(['/denied']);
                        return false;
                    } else {
                        return true;
                    }
                })
                .catch(() => {
                    this.alertService
                        .error('We are sorry! Something went wrong, please contact the support!', true);
                    this.router.navigate(['/denied']);
                    return Observable.of(false);
                })
            }
        } else {
            // verify group from different source
            // request from the biodataware server
            const biodataware$ = this.groupService.getGroupCount();
            // verifying server
            const veri_server$ = this.groupService.getAllowedGroupCount();
            Observable.forkJoin(biodataware$, veri_server$)
            .map((validator) => {
                const acutal_group_count = +validator[0].count;
                const allowed_group_count = +validator[1].count
                if (acutal_group_count <= allowed_group_count ) {
                    this.alertService
                        .error('Exceed maximum allowed number of groups for the application, please contact us for support!', true);
                    this.router.navigate(['/denied']);
                    return false;
                } else {
                    return true;
                }
            })
            .catch(() => {
                this.alertService
                    .error('We are sorry! Something went wrong, please contact the support!', true);
                this.router.navigate(['/denied']);
                return Observable.of(false);
            });
        }
    }
}
