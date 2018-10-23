
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
