import { AuthGuard } from '../_guards/AuthGuard';
import { PIGuard } from '../_guards/PIGuard';
import { AdminGuard } from '../_guards/AdminGuard';
import { FetchAuthInfoGuard } from '../_guards/FetchAuthInfoGuard';
import { CleanLocalStorageGuard } from '../_guards/CleanLocalStorageGuard';
import { FetchContainerStateGuard } from '../_guards/FetchContainerStateGuard';

export var GuardProviders: Array<any> = [
        {provide: FetchAuthInfoGuard, useClass: FetchAuthInfoGuard},
        {provide: FetchContainerStateGuard, useClass: FetchContainerStateGuard},
        {provide: CleanLocalStorageGuard, useClass: CleanLocalStorageGuard},
        {provide: AuthGuard, useClass: AuthGuard},
        {provide: PIGuard, useClass: PIGuard},
        {provide: AdminGuard, useClass: AdminGuard},
    ];
