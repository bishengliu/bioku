import { Action, Reducer } from 'redux';
import { ContainerState } from './container_state';
import { AppState } from '../root/state';
import { initialAppState } from '../root/state';
import { Box } from '../../_classes/Box';
import { Container } from '../../_classes/Container';
import { REDUX_CONSTANTS as C } from '../root/constants';
import { SetMyContainersAction, SetCurrentContainerAction, SetCurrentBoxAction} from './container_actions';


//initial auth status
const initialState: ContainerState = initialAppState.containerInfo;

//define reducers
export const containerReducer: Reducer<ContainerState> =
(state: ContainerState = initialState, action: Action): ContainerState=>{
    switch(action.type){
        case C.SET_MYCONTAINERS_LIST:
            const containers : Array<Container> = (<SetMyContainersAction>action).containers
            return {
                containers : containers,
                currentContainer: state.currentContainer,
                currentBox: state.currentBox
            };
        case C.UNSET_MYCONTAINERS_LIST:
            return state;

        case C.SET_CURRENT_CONTAINER:
            return state;
        case C.UNSET_CURRENT_CONTAINER:
            return state;
        
        case C.SET_CURRENT_BOX:
            return state;
        case C.UNSET_CURRENT_BOX:
            return state;

        default:
            return state;
        }
}