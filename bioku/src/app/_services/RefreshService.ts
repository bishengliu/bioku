import { Injectable } from '@angular/core';
import { AuthState } from '../_redux/account/account_state';

@Injectable()
export class RefreshService
{
    constructor(){}
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
    
    //clean localstorage
    cleanState(): boolean 
    {
        let isRemoved: boolean = false;
        try
        {
            if(localStorage.getItem("authInfo") !== null){
                localStorage.removeItem("authInfo");
                isRemoved = true;
            }
        }
        catch(error)
        {
            isRemoved = false;
        }
        return isRemoved;
    }

    fetchAuthState(): AuthState 
    {
        let authInfo: {
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
}