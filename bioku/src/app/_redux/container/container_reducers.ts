import { Action, Reducer } from 'redux';
import { ContainerState } from './container_state';
import { AppState } from '../root/state';
import { initialAppState } from '../root/state';
import { Box } from '../../_classes/Box';
import { Container } from '../../_classes/Container';
import { REDUX_CONSTANTS as C } from '../root/constants';
import { SetMyContainersAction, SetCurrentContainerAction, SetCurrentBoxAction, SetContainerInfoAction} from './container_actions';


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
                currentContainer: null,
                currentBox: null
            }
        case C.UNSET_MYCONTAINERS_LIST:
            return {
                containers : null,
                currentContainer: null,
                currentBox: null
            }
        case C.SET_CURRENT_CONTAINER:
            const container : Container = (<SetCurrentContainerAction>action).currentContainer;
            return {
                containers : state.containers,
                currentContainer: container,
                currentBox: state.currentBox
            }
        case C.UNSET_CURRENT_CONTAINER:
            return {
                containers : state.containers,
                currentContainer: null,
                currentBox: null
            };        
        case C.SET_CURRENT_BOX:
            const currentContainer : Container = (<SetCurrentBoxAction>action).currentContainer;
            const currentBox : Box = (<SetCurrentBoxAction>action).currentBox;
            return {
                containers : state.containers,
                currentContainer: currentContainer,
                currentBox: currentBox
            }
        case C.UNSET_CURRENT_BOX:
            return {
                containers : state.containers,
                currentContainer: state.currentContainer,
                currentBox: null
            }
        case C.SET_CONTAINER_INFO:
            //set the auti info completely
            const containerState: ContainerState = (<SetContainerInfoAction>action).containerState;
            return {
                containers : containerState.containers, //only update the containers
                currentContainer: state.currentContainer,
                currentBox: state.currentBox
            }
        default:
            return state;
        }
}