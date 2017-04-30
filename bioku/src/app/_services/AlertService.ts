import { Alert } from '../_classes/Alert';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Router, NavigationStart } from '@angular/router';


@Injectable()
export class AlertService{
    private subject$ = new Subject<Alert>();
    private keepPostNavigation: Boolean = false;
    dismissMessage: Boolean = true;
    constructor(private router: Router){
        // clear alert message on route change
        router.events.subscribe(event =>{
            if(event instanceof NavigationStart){
                if (this.keepPostNavigation){
                    // only keep for a single location change
                    this.keepPostNavigation = false;
                }
                else{
                    //clear alert
                    this.subject$.next();
                }
            }
        });    
    }

    success(message: string, keepPostNavigation=true){
        this.keepPostNavigation = keepPostNavigation;
        this.subject$.next(<Alert>({type:'success', text: message}));

        //dismiss message
        if(this.dismissMessage){
            //clear message
            setTimeout(()=>{
                this.clearMessage();
            }, 5000);
        }        
    }

    error(message: string, keepPostNavigation=true){
        this.keepPostNavigation = keepPostNavigation;
        this.subject$.next(<Alert>({type:'error', text: message})); 
        //dismiss message
        if(this.dismissMessage){
            //clear message
            setTimeout(()=>{
                this.clearMessage();
            }, 5000);
        }         
    }

    getMessage(): Observable<Alert> {
        return this.subject$.asObservable();
    }

    clearMessage(): void{
        this.subject$.next();
    }
}
