import { Injectable , Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertService } from '../_services/AlertService';
import { AppSetting } from '../_config/AppSetting';
import { APP_CONFIG } from '../_providers/AppSettingProvider';

@Injectable()
export class ContainerSampleUploadGuard implements CanActivate {
    constructor(@Inject(APP_CONFIG) private appSetting: any, private alertService: AlertService, private router: Router ) {}
    canActivate(): boolean {
        if (this.appSetting.ALLOW_UPLOAD_SAMPLES_2_CONTAINER) {
            return true;
        } else {
            this.alertService.error('Upload samples to the container is not allowed, please contact the support!', true);
            this.router.navigate(['/denied']);
        }
        return false;
    }
}
