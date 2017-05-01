import {AuthGuard} from '../_guards/AuthGuard';

export var GuardProviders: Array<any> = [
        {provide: AuthGuard, useClass: AuthGuard},
        
    ];
