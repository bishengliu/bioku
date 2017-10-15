import { Action, Reducer } from 'redux';
import { AuthState } from './account_state';
import { AppState } from '../root/state';
import { initialAppState } from '../root/state';
import { User, TokenObj } from '../../_classes/User';
import { Group } from '../../_classes/Group';
import { REDUX_CONSTANTS as C } from '../root/constants';
import { SetAuthUserAction, SetAuthTokenAction, SetAuthGroupAction, SetAuthInfoAction} from './account_actions';

// initial auth status
const initialState: AuthState = initialAppState.authInfo;

// define reducers
export const authReducer: Reducer<AuthState> =
function (state: AuthState = initialState, action: Action): AuthState {
    switch (action.type) {
        case C.SET_AUTH_USER:
            // set auth user
            const user: User = (<SetAuthUserAction>action).authUser;
            return {
                authUser: Object.assign({}, state.authUser, user),
                authGroup: state.authGroup,
                token: state.token
            }
        case C.SET_TOKEN:
            // set token
            const token: TokenObj = (<SetAuthTokenAction>action).token;
            return {
                authUser: state.authUser,
                authGroup: state.authGroup,
                token: token
            }
        case C.UNSET_AUTH_USER:
            // clear auth user
            return {
                authUser: null,
                authGroup: state.authGroup,
                token: state.token
            }
        case C.UNSET_TOKEN:
            // unset token
            return {
                authUser: state.authUser,
                authGroup: state.authGroup,
                token: null
            }
        case C.SET_GROUP_DETAILS:
            const groups: Array<Group> = (<SetAuthGroupAction>action).authGroup;
            // set group details
            return {
                authUser: state.authUser,
                authGroup: groups,
                token: state.token
            }
        case C.UNSET_GROUP_DETAILS:
            // unset group
            return {
                authUser: state.authUser,
                authGroup: null,
                token: state.token
            }
        case C.SET_AUTH_INFO:
            // set the auti info completely
            const authInfo: AuthState = (<SetAuthInfoAction>action).authInfo;
            return {
                authUser: authInfo.authUser,
                authGroup: authInfo.authGroup,
                token: authInfo.token
            }
        default:
            return state;
    }
}
