import { Injectable , Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AppSetting } from '../_config/AppSetting';
import { APP_CONFIG } from '../_providers/AppSettingProvider';
// redux
import { AppStore } from '../_providers/ReduxProviders';

@Injectable()
export class ChangePasswordService {

    constructor(private http: Http, @Inject(APP_CONFIG) private appSetting: any, @Inject(AppStore) private appStore) {}

    changePassword(username: string, old_password: string, new_password: string) {
        const change_password_url: string = this.appSetting.URL + this.appSetting.CHANGE_PASSWORD;
        const body: string = JSON.stringify({'old_password': old_password, 'new_password': new_password});

        // get the token
        const state = this.appStore.getState();
        if (!state || !state.authInfo || !state.authInfo.token) {
            return Observable.throw('Please first login');
        }
        const headers = new Headers({ 'Authorization': 'Token ' + state.authInfo.token.token, 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.put(change_password_url, body, options)
                .map((response: Response) => response.json())
                .catch((error: any) => Observable.throw(error || 'Server error'));
    };
}
