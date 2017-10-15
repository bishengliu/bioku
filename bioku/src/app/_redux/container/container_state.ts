import { Box } from '../../_classes/Box';
import { Container } from '../../_classes/Container';

export interface ContainerState {
    containers: Array<Container>;
    currentContainer: Container;
    currentBox: Box;
}
