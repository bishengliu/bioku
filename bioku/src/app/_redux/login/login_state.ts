import {User} from '../../_classes/User';
import {Group} from '../../_classes/Group';

export interface AuthState{
    authUser: User;
    token: string;
    authGroup: Group;
}

