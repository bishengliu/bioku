import { Injectable , Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertService } from '../_services/AlertService';
import { AppSetting } from '../_config/AppSetting';
import { APP_CONFIG } from '../_providers/AppSettingProvider';
import { AppStore } from '../_providers/ReduxProviders';

@Injectable()
export class AppActiveGuard implements CanActivate {
    constructor(@Inject(APP_CONFIG) private appSetting: any, private alertService: AlertService, private router: Router,
                @Inject(AppStore) private appStore, ) {}
    canActivate(): boolean {
        if (this.appSetting.APP_KEEP_ACTIVE) {
            return true;
        } else {
            // app start date
            const pattern = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
            const sArray = this.appSetting.APP_START_DATE.match(pattern);
            if (sArray !== null) {
                const app_start_date = new Date(sArray[1], sArray[2] - 1, sArray[3]);
                const current_date  = new Date();
                const diff = Math.floor(current_date.getTime() - app_start_date.getTime());
                if (diff >= 0) {
                    const one_day = 1000 * 60 * 60 * 24;
                    const diff_days = Math.floor(diff / one_day);
                    if (diff_days <= this.appSetting.ACTIVE_FOR_DAYS) {
                        return true;
                    }
                }
            }
            this.alertService
                    .error('We are sorry! Something went wrong, please contact the support!', true);
                this.router.navigate(['/denied']);
            return false;
        }
    }
}
