export class BoxLabel {
    box_has_label: Boolean; // true or false
    box_defined_as_normal: Boolean; // default true
    box_tsb_one_column: Boolean; // default true, "tower", "shelf" and "box" in one data column
    box_sample_separated: Boolean; // default true, box position is separated from sample position in my excel
    prefix: string; // default '', nothing
    appendix: string; // default '', nothing
    join: string; // default -'
    tower: number; // default 1,  0 leters, 1: digits
    shelf: number; // default 1,  0 leters, 1: digits
    box: number; // default 1,  0 leters, 1: digits
}

export class SampleLabel {
    sampleLabelDefinition: number; // default 0, row-column: 0 in one data column; 1: in 2 columns; 2: increasing numbers
    boxLabel: number; // default 0,  0 leters, 1: digits
    boxJoin: string; // default '', nothing
    sampleRow: number; // default 0,  0 leters, 1: digits
    sampleColumn: number; // default 1,  0 leters, 1: digits
    sampleJoin: string; // default '', nothing
    box_horizontal: number;
    box_vertical: string;
}

export class SampleFile {
    sample_type: string; // default 'GENERAL'
    max_column_count: number;
    column_count: number;
    excel_file_has_header: Boolean; // default true
}

export class ColumnAttr {
    col_number: number;
    col_header: string;
    sample_attr_index: number;
}

export class SampleExcelHeaders {
    header_type: string;
    headers: Array<string>;
}

export class SampleUploadDateFormat {
    date_attr_label: string;
    date_attr_name: string;
    date_attr_index: number;
    date_date_included: boolean;
    date_format_is_set: boolean;
    format: SampleDateFormat;
}

export class SampleDateFormat {
    day_position: number; // 1, 2, 3, day start with 1
    month_position: number;
    month_format: number; // 0 is the numeric format, start with 1; 1: full text month, 2: shot 3-letter abbreviation format
    year_position: number;
    year_format: number; // 0 is yyyy; 1 is yy
    join_symbol: string; // '-', '', ' ' or '/'
}

export class SampleValidator {
    validation_steps: Array<string>;
    validation_steps_icons: Array<string>;
    validator_pointer: number;
    validator_outputs: Array<ValidatorOutput>;
    validation_status: Boolean; // true -- passed; false-- failed
}

export class ValidatorOutput {
    validation_step: string;
    status: number; // 0 passed, 1, passed with warning; 2 failed, 3 info;
    message: string;
}
