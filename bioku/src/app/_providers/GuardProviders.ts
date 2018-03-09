import { AuthGuard } from '../_guards/AuthGuard';
import { PIGuard } from '../_guards/PIGuard';
import { AdminGuard } from '../_guards/AdminGuard';
import { FetchAuthInfoGuard } from '../_guards/FetchAuthInfoGuard';
import { CleanLocalStorageGuard } from '../_guards/CleanLocalStorageGuard';
import { ContainerSampleUploadGuard } from '../_guards/ContainerSampleUploadGuard';
import { GroupCountGuard } from '../_guards/GroupCountGuard';
import { AppActiveGuard } from '../_guards/AppActiveGuard';

export const GuardProviders: Array<any> = [
        {provide: FetchAuthInfoGuard, useClass: FetchAuthInfoGuard},
        {provide: CleanLocalStorageGuard, useClass: CleanLocalStorageGuard},
        {provide: AuthGuard, useClass: AuthGuard},
        {provide: PIGuard, useClass: PIGuard},
        {provide: AdminGuard, useClass: AdminGuard},
        {provide: ContainerSampleUploadGuard, useClass: ContainerSampleUploadGuard},
        {provide: GroupCountGuard, useClass: GroupCountGuard},
        {provide: AppActiveGuard, useClass: AppActiveGuard},
    ];
