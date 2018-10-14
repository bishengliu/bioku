
export class CType {
    pk: number;
    group_id: number;
    is_public: boolean;
    description: string
}

export class CTypeAttr {
    pk: number;
    ctype_id: number;
    attr_name: string;
    attr_label: string;
    attr_value_type: number; // 0: string, 1, digit; 2, decimal; 3 has sub attr
    attr_value_text_max_length: number;
    attr_value_decimal_total_digit: number;
    attr_value_decimal_point: number;
    attr_required: boolean;
    attr_order: number;
    has_sub_attr: boolean;
    sub_attrs: Array<CtypeSubAttr>;
}

export class CtypeSubAttr {
    pk: number;
    ctype_id: number;
    attr_id: number;
    attr_name: string;
    attr_label: string;
    attr_value_type: number; // 0: string, 1, digit; 2, decimal; 3 has sub attr
    attr_value_text_max_length: number;
    attr_value_decimal_total_digit: number;
    attr_value_decimal_point: number;
    attr_required: boolean;
    attr_order: number;
}
