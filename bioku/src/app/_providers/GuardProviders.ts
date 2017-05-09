import { AuthGuard } from '../_guards/AuthGuard';
import { PIGuard } from '../_guards/PIGuard';
import { AdminGuard } from '../_guards/AdminGuard';


export var GuardProviders: Array<any> = [
        {provide: AuthGuard, useClass: AuthGuard},
        {provide: PIGuard, useClass: PIGuard},
        {provide: AdminGuard, useClass: AdminGuard},
    ];
