import { Injectable, Inject } from '@angular/core';
import { AuthState } from '../_redux/account/account_state';
import { ContainerState } from '../_redux/container/container_state';
import { AppPartialState, AppState } from '../_redux/root/state';
import { AppStore } from '../_providers/ReduxProviders';
import { SetContainerInfoAction, SetContainerInfoActionCreator } from '../_redux/container/container_actions';
@Injectable()
export class RefreshService
{
    constructor(@Inject(AppStore) private appStore,){}
    //save redux authInfo into localstrage
    dumpAuthState(authInfo: AuthState): void
    {
        try{
            if(typeof(Storage) === "undefined"){
                console.log("brower doesn't support HTML5 LocalStorage, cannot enable refresh service!");
            }
            else{
                //dump the authInfo
                if(localStorage.getItem("authInfo") !== null){
                    localStorage.removeItem("authInfo");                
                }
                localStorage.setItem('authInfo', JSON.stringify(authInfo));
                //console.log(localStorage.getItem("authInfo"));
                console.log("authInfo dumped!");
            }
        }
        catch(error)
        {
            console.log("failed to dump authInfo!");           
        }        
    }
    
    //dump ContainerState
    dumpContainerState(containerInfo: ContainerState): void{
        try{
            if(typeof(Storage) === "undefined"){
                console.log("brower doesn't support HTML5 LocalStorage, cannot enable refresh service!");
            }
            else{
                //dump the containerInfo
                if(localStorage.getItem("containerInfo") !== null){
                    localStorage.removeItem("containerInfo");                
                }
                localStorage.setItem('containerInfo', JSON.stringify(containerInfo));
                //console.log(localStorage.getItem("containerInfo"));
                console.log("containerInfo dumped!");
            }
        }
        catch(error)
        {
            console.log("failed to dump containerInfo!");           
        }
    }

    //clean localstorage
    cleanState(): void 
    {
        try
        {
            //autoInfo
            if(localStorage.getItem("authInfo") !== null){
                localStorage.removeItem("authInfo");
            }
            //containerInfo
            if(localStorage.getItem("containerInfo") !== null){
                localStorage.removeItem("containerInfo");
            }
        }
        catch(error)
        {
            console.log("failed to clean localStorage!");  
        }
    }

    //clean container state only
    cleanContainerState(){
        try{
            //containerInfo
            if(localStorage.getItem("containerInfo") !== null){
                localStorage.removeItem("containerInfo");
            }
        }
        catch(error){
            console.log("failed to clean container info from local storage!");  
        }
    }

    //fetch authInfo
    fetchAuthState(): AuthState 
    {
        let authInfo = {
            authUser: null,
            authGroup: null,
            token: null }
        try
        {
            if(localStorage.getItem("authInfo") !== null){
                let authInfoString = localStorage.getItem("authInfo");
                authInfo = JSON.parse(authInfoString);   
            }
        }
        catch(error)
        {
            authInfo = {
                authUser: null,
                authGroup: null,
                token: null }
        }
        return authInfo;
    }

    //fetch containerInfo
    fetchContainerState(): ContainerState{
        let containerInfo = {
            containers: null,
            currentContainer: null,
            currentBox: null };
        try
        {
            if(localStorage.getItem("containerInfo") !== null){
                let containerInfoString = localStorage.getItem("containerInfo");
                containerInfo = JSON.parse(containerInfoString);   
            }
        }
        catch(error)
        {
            containerInfo = {
                containers: null,
                currentContainer: null,
                currentBox: null };
        }
        return containerInfo;
    }

    //fetch AppPartialState for both
    fetchReduxState(): AppPartialState{
        let reduxAppState: AppPartialState = {
            //auth user
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

    dispatchContainerInfo(){
        //fetch container info
        this.fetchContainerState();
        let conatinerInfo : ContainerState = this.fetchContainerState();
        //redux reducers
        let setContainerInfoAction: SetContainerInfoAction = SetContainerInfoActionCreator(conatinerInfo);
        this.appStore.dispatch(setContainerInfoAction);
    }
}