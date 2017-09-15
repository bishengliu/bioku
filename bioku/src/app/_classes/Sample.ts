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
export class SampleGeneral {
    pk: number;
    box: string;
    box_id: number;
    color: string;
    date_in: Date;
    date_out: Date;
    type: string;
    name: string;
    official_name: string;
    label: string;
    tag: string;
    registration_code: string; // primary code
    reference_code: string;
    quantity: number;
    quantity_unit: string;
    freezing_code: string;
    freezing_date: Date;
    hposition: string;
    vposition: string;
    position: string;
    occupied: Boolean;
    qrcode: string;
    code39: string;
    researchers: Array<User>;
    attachments: Array<Attachment>;
    description: string;
}
export class SampleConstruct {
    clone_number: string;
    against_260_280: number;
    feature: string;
    r_e_analysis: string;
    backbone: string;
    insert: string;
    first_max: string;
    marker: string;
    has_glycerol_stock: boolean;
    strain: string;
}

export class SampleVirus {
    passage_number: string;
    cell_amount: string;
    project: string;
    creator: string;
}

export class SampleOligo {
    oligo_name: string;
    s_or_as: boolean;
    oligo_sequence: string;
    oligo_length: number;
    oligo_GC: number;
    target_sequence: string;
}

export class SampleCellLine {
    plasmid: string;
    titration_titer: string;
    titration_unit: string;
    titration_cell_type: string;
    titration_code: string;
}

export class SampleTissue {
    pathology_code: string;
    tissues: Array<Tissue>;
}

export class Sample extends SampleGeneral {
    //construct
    clone_number: string;
    against_260_280: number;
    feature: string;
    r_e_analysis: string;
    backbone: string;
    insert: string;
    first_max: string;
    marker: string;
    has_glycerol_stock: boolean;
    strain: string;
    //virus
    passage_number: string;
    cell_amount: string;
    project: string;
    creator: string;
    //oligo
    oligo_name: string;
    s_or_as: boolean;
    oligo_sequence: string;
    oligo_length: number;
    oligo_GC: number;
    target_sequence: string;
    //cell line
    plasmid: string;
    titration_titer: string;
    titration_unit: string;
    titration_cell_type: string;
    titration_code: string;
    //tissue
    pathology_code: string;
    tissues: Array<Tissue>;
}

export class SampleFilter {
    key: string;
    value: string;
} 