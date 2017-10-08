import { Group } from './Group';
import { Box } from './Box';

export class Container{
    pk: number;
    name: string;
    room: string;
    photo: string;
    photo_tag: string;
    temperature:number;
    code39: string;
    qrcode: string;
    tower: number;
    shelf: number;
    box: number;
    description: string;
    groups: Array<Group>;
    boxes: Array<Box>;
    has_box: boolean;
}

export class ContainerNamePK{
    pk: number;
    name: string;
}