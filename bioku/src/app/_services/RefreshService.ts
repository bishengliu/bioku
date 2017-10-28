import { Injectable, Inject } from '@angular/core';
import { AuthState } from '../_redux/account/account_state';
import { ContainerState } from '../_redux/container/container_state';
import { AppPartialState, AppState } from '../_redux/root/state';
import { AppStore } from '../_providers/ReduxProviders';
import { SetContainerInfoAction, SetContainerInfoActionCreator } from '../_redux/container/container_actions';
import { AppSetting } from '../_config/AppSetting';
import { APP_CONFIG } from '../_providers/AppSettingProvider';
import { Router } from '@angular/router';
import { AlertService } from '../_services/AlertService'
@Injectable()
export class RefreshService {
    private appAuthAimeStamp = this.appSetting.NAME + '-AUTH-TIMESTAMP';
    private authInfo = 'authInfo';
    private containerInfo = 'containerInfo';
    constructor(@Inject(AppStore) private appStore, @Inject(APP_CONFIG) private appSetting: any,
                private router: Router, private alertService: AlertService) {}
    // save redux authInfo into localstrage
    dumpAuthState(authInfo: AuthState): void {
        try {
            // DUMP AUTHINFO
            if (typeof(Storage) === 'undefined') {
                // tslint:disable-next-line:quotemark
                console.log("brower doesn't support HTML5 LocalStorage, cannot enable refresh service!");
            } else {
                // dump the authInfo
                if (localStorage.getItem(this.authInfo) !== null) {
                    localStorage.removeItem(this.authInfo);
                }
                localStorage.setItem(this.authInfo, JSON.stringify(authInfo));
                // console.log(localStorage.getItem("authInfo"));
                // console.log(this.authInfo + " dumped!");
                // MARK TIMESTAMP
                if (localStorage.getItem(this.appAuthAimeStamp) != null) {
                    localStorage.removeItem(this.appAuthAimeStamp);
                } else {
                    localStorage.setItem(this.appAuthAimeStamp, JSON.stringify(new Date().getTime())); // milliseconds
                    // console.log(this.appAuthAimeStamp +" dumped!");
                    // console.log(localStorage.getItem(this.appAuthAimeStamp));
                }
            }
        } catch (error) {
            console.log('failed to dump authInfo!');
        }
    }

    // dump ContainerState
    dumpContainerState(containerInfo: ContainerState): void {
        try {
            if (typeof(Storage) === 'undefined') {
                console.log("brower doesn't support HTML5 LocalStorage, cannot enable refresh service!");
            } else {
                // dump the containerInfo
                if (localStorage.getItem(this.containerInfo) !== null) {
                    localStorage.removeItem(this.containerInfo);
                }
                localStorage.setItem(this.containerInfo, JSON.stringify(containerInfo));
                // console.log(localStorage.getItem("containerInfo"));
                // console.log(this.containerInfo + " dumped!");
            }
        } catch (error) {
            console.log('failed to dump containerInfo!');
        }
    }

    // clean localstorage
    cleanState(): void {
        try {
            // auth timestamp
            if (localStorage.getItem(this.appAuthAimeStamp) !== null) {
                localStorage.removeItem(this.appAuthAimeStamp);
            }
            // autoInfo
            if (localStorage.getItem(this.authInfo) !== null) {
                localStorage.removeItem(this.authInfo);
            }
            // containerInfo
            if (localStorage.getItem(this.containerInfo) !== null) {
                localStorage.removeItem(this.containerInfo);
            }
        } catch (error) {
            console.log('failed to clean localStorage!');
        }
    }

    // clean container state only
    cleanContainerState() {
        try {
            // containerInfo
            if (localStorage.getItem(this.containerInfo) !== null) {
                localStorage.removeItem(this.containerInfo);
            }
        } catch (error) {
            console.log('failed to clean container info from local storage!');
        }
    }

    // fetch authInfo
    fetchAuthState(): AuthState {
        let authInfo = {
            authUser: null,
            authGroup: null,
            token: null }
        try {
            if (localStorage.getItem(this.authInfo) !== null && localStorage.getItem(this.appAuthAimeStamp) !== null) {
                // check time lapse
                const old_timestamp =  localStorage.getItem(this.appAuthAimeStamp);
                const current_timestamp = new Date().getTime();
                if (!isNaN(+old_timestamp)) {
                    const diff_ts = current_timestamp - +old_timestamp;
                    const diff_seconds = Math.floor(diff_ts / 1000);
                    const time_lapse_by_hour = diff_seconds / 3600;
                    // check time lapse for token auth
                    if (time_lapse_by_hour > this.appSetting.TOKEN_EXPIRATION_HOUR) {
                        // login
                        this.alertService.error('Please login again!', true);
                        this.cleanState();
                        this.router.navigate(['/login']);
                    } else {
                        // get authInfo
                        const authInfoString = localStorage.getItem(this.authInfo);
                        authInfo = JSON.parse(authInfoString);
                    }
                }
            } else {
                // login
                this.alertService.error('Please login first!', true);
                this.cleanState();
                this.router.navigate(['/login']);
            }
        }catch (error) {
            authInfo = {
                authUser: null,
                authGroup: null,
                token: null }
        }
        return authInfo;
    }

    // fetch containerInfo
    fetchContainerState(): ContainerState {
        let containerInfo = {
            containers: null,
            currentContainer: null,
            currentBox: null };
        try {
            if (localStorage.getItem(this.containerInfo) !== null) {
                const containerInfoString = localStorage.getItem(this.containerInfo);
                containerInfo = JSON.parse(containerInfoString);
            }
        } catch (error) {
            containerInfo = {
                containers: null,
                currentContainer: null,
                currentBox: null };
        }
        return containerInfo;
    }

    // fetch AppPartialState for both
    fetchReduxState(): AppPartialState {
        const reduxAppState: AppPartialState = {
            // auth user
            authInfo: {
                authUser: null,
                authGroup: null,
                token: null
            },
            containerInfo: {
                containers: null,
                currentContainer: null,
                currentBox: null
            }
        }
        reduxAppState.authInfo = this.fetchAuthState();
        reduxAppState.containerInfo = this.fetchContainerState();
        return reduxAppState;
    }

    dispatchContainerInfo() {
        // fetch container info
        this.fetchContainerState();
        const conatinerInfo: ContainerState = this.fetchContainerState();
        // redux reducers
        const setContainerInfoAction: SetContainerInfoAction = SetContainerInfoActionCreator(conatinerInfo);
        this.appStore.dispatch(setContainerInfoAction);
    }
}
