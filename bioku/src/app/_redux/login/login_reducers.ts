import { AuthStatus } from './login_state';
import { User } from '../../_classes/User';

const initialState: AuthStatus = {
    authUser: null,
    isLogin: false,
    token: null
}

