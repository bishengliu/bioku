import { User } from './User';

// export class Tissue {
//     pk: number;
//     sample: string;
//     system: string;
//     tissue: string;
// }

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
    container_id: number;
    container: string;
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

export class SampleConstruct extends SampleGeneral {
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

export class SampleCell extends SampleGeneral {
    passage_number: string;
    cell_amount: string;
    project: string;
    creator: string;
}

export class SampleOligo extends SampleGeneral {
    oligo_name: string;
    s_or_as: boolean;
    oligo_sequence: string;
    oligo_length: number;
    oligo_GC: number;
    target_sequence: string;
}

export class SampleVirus extends SampleGeneral {
    plasmid: string;
    titration_titer: string;
    titration_unit: string;
    titration_cell_type: string;
    titration_code: string;
}

export class SampleTissue extends SampleGeneral{
    pathology_code: string;
    //tissues: Array<Tissue>;
    tissue: string;
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
    //cell line
    amount: string;
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
    //virus
    plasmid: string;
    titration_titer: string;
    titration_unit: string;
    titration_cell_type: string;
    titration_code: string;
    //tissue
    pathology_code: string;
    tissue: string;
    //tissues: Array<Tissue>;
}

export class SampleFilter {
    key: string;
    value: string;
}

export class SampleSearch {
    container: number;
    type: string; //['GENERAL', 'CELL', 'CONSTRUCT', 'OLIGO', 'gRNA_OLIGO', 'TISSUE', 'VIRUS']
    name: string;
    label: string; //user defined label
    tag: string;
    registration_code: string; // primary code
    reference_code: string;
    freezing_code: string;
    freezing_date_from: string;
    freezing_date_to: string;
    occupied: number; //2==both; 0==occupied only; 1==taken-out only

    //construct
    feature: string;
    backbone: string;
    insert: string;
    marker: string;

    //oligo
    oligo_name: string;
    oligo_length_from: number;
    oligo_length_to: number;

    //virus
    plasmid: string;
    titration_code: string;

    //tissue
    pathology_code: string;
    tissue: string;
}