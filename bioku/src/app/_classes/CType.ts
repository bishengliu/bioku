import { User } from './User';
export class CType {
    pk: number;
    type: string;
    group_id: number;
    is_public: boolean;
    description: string;
    attrs: Array<CTypeAttr>;
}

export class CTypeAttr {
    pk: number;
    ctype_id: number;
    attr_name: string;
    attr_label: string;
    attr_value_type: number; // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
    attr_value_text_max_length: number;
    attr_value_decimal_total_digit: number;
    attr_value_decimal_point: number;
    attr_required: boolean;
    attr_order: number;
    has_sub_attr: boolean;
    subattrs: Array<CTypeSubAttr>;
}

export class CTypeSubAttr {
    pk: number;
    ctype_id: number;
    parent_attr_id: number;
    attr_name: string;
    attr_label: string;
    attr_value_type: number; // 0: string, 1, digit; 2, decimal; 3 has sub attr; 4 date
    attr_value_text_max_length: number;
    attr_value_decimal_total_digit: number;
    attr_value_decimal_point: number;
    attr_required: boolean;
    attr_order: number;
}

export class CSample {
    pk: number;
    ctype_id: number;
    vposition: string;
    hposition: string;
    position: string;
    date_in: Date;
    name: string;
    storage_date: Date;
    box: string;
    box_id: number;
    date_out: Date;
    occupied: Boolean;
    color: string;
    attachments: Attachment;
    ctype: CType;
    csample_data: Array<CSampleData>;
    cample_subdata: Array<CSampleSubData>;
    researchers: Array<User>;
    container_id: string;
    container: string;
    box_position: string;
}

export class CSampleData {
    pk: number;
    csample_id: number;
    ctype_attr_id: number;
    ctype_attr: Array<CTypeAttr>;
    ctype_attr_value_part1: string;
    ctype_attr_value_part2: string;

}

export class CSampleSubData {
    pk: number;
    csample_id: number;
    ctype_sub_attr_id: number;
    ctype_sub_attr: Array<CTypeSubAttr>;
    ctype_attr_value_part1: string;
    ctype_attr_value_part2: string;
}

export class Attachment {
    pk: number;
    csample_id: number;
    label: string;
    attachment: string;
    description: string;
}
