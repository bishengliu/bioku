import { User } from './User';
import { Sample } from './Sample';

export class Box {
    pk: number;
    label: string;
    box_position: string;
    box_vertical: number;
    box_horizontal: number;
    tower: number;
    shelf: number;
    box: number;
    code39: string;
    qrcode: string;
    color: string;
    rate: number;
    description: string;
    researchers: Array<User>;
    samples: Array<Sample>;
    sample_count: number;
}

export class BoxFilter {
    tower: number;
    shelf: number;
    box: number
}
