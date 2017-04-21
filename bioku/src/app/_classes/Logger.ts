import {AppPartialState} from '../_redux/root/state';

export class AppLog{
    action: string;
    timestamp: Date;
    preState: AppPartialState;
    nextState: AppPartialState;
    message: string;
}