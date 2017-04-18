import {User} from '../../_classes/User';

export interface AuthStatus{
    authUser: User;
    isLogin: Boolean;
    token: string;
}

