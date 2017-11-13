import { Injectable , Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertService } from '../_services/AlertService';
import { AppSetting} from '../_config/AppSetting';
import { APP_CONFIG } from '../_providers/AppSettingProvider';
import { AppStore } from '../_providers/ReduxProviders';
import {GroupService} from '../_services/GroupService';
@Injectable()
export class GroupCountGuard implements CanActivate {
    gCount: Number = 0;
    constructor(@Inject(APP_CONFIG) private appSetting: any, private alertService: AlertService, private router: Router,
                @Inject(AppStore) private appStore, private groupService: GroupService) {}

    canActivate(): boolean {
        if (this.appSetting.MAX_G === -1) {
            return true;
        } else {
            this.groupService.getGroupCount()
            .subscribe(
                c => {
                    this.gCount = c.count;
                    if (this.gCount > this.appSetting.MAX_G) {
                        this.alertService
                        .error('Exceded maximum allowed number of groups for the application, please contact us for support!', true);
                        this.router.navigate(['/denied']);
                        return false;
                    } else {
                        return true;
                    }
                },
                e => {
                    this.gCount = 0;
                    return false;
                 }
              );
            return false;
        }
    }
}
