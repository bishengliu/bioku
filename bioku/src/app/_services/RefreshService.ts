import { Injectable } from '@angular/core';
import { AuthState } from '../_redux/account/account_state';
@Injectable()
export class RefreshService
{
    constructor(){}
    //save redux data into localstrage
    dumpState(authInfo: AuthState): void{
        try{
            if(typeof(Storage) === "undefined"){
                console.log("brower doesn't support HTML5 LocalStorage, cannot enable refresh service!");
            }
            else{
                //dump the data
                if(localStorage.getItem("authInfo") !== null){
                    localStorage.removeItem("authInfo");                
                }
                localStorage.setItem('authInfo', JSON.stringify(authInfo));
            }
        }
        catch{
            console.log("failed to dump authInfo!");           
        }
        
    }
    cleanState(): boolean {
        let isRemoved: boolean = false;
        try{
            if(localStorage.getItem("authInfo") !== null){
                localStorage.removeItem("authInfo");
                isRemoved = true;
            }
        }
        catch{
            isRemoved = false;
            //need to enforce page refresh
        }
        return isRemoved;
    }
    fetchState(): AuthState {
        let authInfo: {
            authUser: null,
            authGroup: null,
            token: null }
        try{
            if(localStorage.getItem("authInfo") !== null){
                let authInfoString = localStorage.getItem("authInfo");
                authInfo = JSON.parse(authInfoString);   
            }
        }
        catch{
            authInfo = {
                authUser: null,
                authGroup: null,
                token: null }
        } 
        return authInfo;
    }
}