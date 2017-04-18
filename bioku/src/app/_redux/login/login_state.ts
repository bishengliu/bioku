import {User} from '../../_classes/User';

export interface AuthStatus{
    authUser: User;
    token: string;
}

