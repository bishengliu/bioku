import { Group } from './Group';
import { Box } from './Box';

export class Container {
    pk: number;
    name: string;
    room: string;
    photo: string;
    photo_tag: string;
    temperature: number;
    code39: string;
    qrcode: string;
    tower: number;
    shelf: number;
    box: number;
    description: string;
    groups: Array<Group>;
    boxes: Array<Box>;
    first_box: Box; // get the first box in the container
    has_box: boolean;
    sample_count: number;
}

export class ContainerNamePK {
    pk: number;
    name: string;
}
