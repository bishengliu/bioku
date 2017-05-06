import { AuthGuard } from '../_guards/AuthGuard';
import { PIGuard } from '../_guards/PIGuard';


export var GuardProviders: Array<any> = [
        {provide: AuthGuard, useClass: AuthGuard},
        {provide: PIGuard, useClass: PIGuard},
    ];
