import {AppState} from '../_redux/root/state';

export class AppLog{
    action: string;
    timestamp: Date;
    preState: AppState;
    nextState: AppState;
    message: string;
}