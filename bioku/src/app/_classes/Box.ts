import { User } from './User';
export class Box{
    pk: number;
    box_position: string;
    box_vertical: number;
    box_horizontal: number;
    temperature:number;
    tower: number;
    shelf: number;
    box: number;
    code39: string;
    qrcode: string;
    researchers: Array<User>;
}