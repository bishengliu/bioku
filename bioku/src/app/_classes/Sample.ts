import { User } from './User';

export class Tissue {
    pk: number;
    sample: string;
    system: string;
    tissue: string;
}

export class Attachment {
    pk: number;
    sample_id: number;
    label: string;
    attachment: string;
    description: string;
}

export class Sample {
    pk: number;
    box: string;
    box_id: number;
    code39: string;
    color: string;
    date_in: Date;
    date_out: Date;
    description: string;
    freezing_code: string;
    freezing_date: Date;
    hposition: string;
    name: string;
    occupied: Boolean;
    pathology_code: string;
    position: string;
    qrcode: string;
    quantity: number;
    registration_code: string;
    tissues: Array<Tissue>;
    attachments: Array<Attachment>;
    type: string;
    vposition: string;
    researchers: Array<User>;
}