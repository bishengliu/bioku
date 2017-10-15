// get user token and detail by posting username and password
import { Injectable , Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting} from '../_config/AppSetting';
import { APP_CONFIG } from '../_providers/AppSettingProvider';

@Injectable()
export class ResetPasswordService {
    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any) {}
    // request reset password
    resetPassword(obj: any) {
        const query_url: string  = this.appSetting.URL +  '/api/users' + this.appSetting.RESET_PASSWORD;
        const body: string = JSON.stringify({obj});
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(query_url, body, options)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    performResetPassword(uid: string, token: string, new_password1: string, new_password2: string) {
        const query_url: string  = this.appSetting.URL +  '/api/users' + this.appSetting.RESET_PASSWORD_CONFRIM + uid + '/' + token + '/';
        const body: string = JSON.stringify({
            'new_password1': new_password1,
            'new_password2': new_password2
        });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(query_url, body, options)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
