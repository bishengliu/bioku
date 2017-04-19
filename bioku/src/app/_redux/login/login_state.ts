import {User} from '../../_classes/User';

export interface AuthState{
    authUser: User;
    token: string;
}

