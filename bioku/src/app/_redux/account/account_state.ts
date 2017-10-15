import {User, TokenObj} from '../../_classes/User';
import {Group} from '../../_classes/Group';

export interface AuthState {
    authUser: User;
    token: TokenObj;
    authGroup: Array<Group>;
}

