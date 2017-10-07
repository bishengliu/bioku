import { Injectable , Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RefreshService } from '../_services/RefreshService'
import { AlertService } from '../_services/AlertService'
import { AppStore } from '../_providers/ReduxProviders';
import { ContainerState } from '../_redux//container/container_state';
import { SetContainerInfoAction, SetContainerInfoActionCreator } from '../_redux/container/container_actions';

@Injectable()
export class FetchContainerStateGuard implements CanActivate
{
    constructor(@Inject(AppStore) private appStore, private refreshService: RefreshService){}
    canActivate(): boolean{
        let state = this.appStore.getState();
        if(state != null && state.conatinerInfo != null){
            if(state.conatinerInfo.conatiners == null){
                //fetch container data from local storage
                let conatinerInfo : ContainerState = this.refreshService.fetchContainerState();
                //redux reducers
                let setContainerInfoAction: SetContainerInfoAction = SetContainerInfoActionCreator(conatinerInfo);
                this.appStore.dispatch(setContainerInfoAction);
            }
        }
        
        console.log('fetch conatiners info from local storage');
        return true;
    }  
}