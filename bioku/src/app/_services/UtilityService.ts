import { Injectable , Inject} from '@angular/core';
import { digest } from '@angular/compiler/src/i18n/serializers/xmb';
import { CSample, CAttachment, CTypeAttr, MCTypeAttr, CSampleData, CSampleSubData, CType,
    CSubAttrData, CTypeSubAttr, MCTypeSubAttr, MCSubAttrData } from '../_classes/CType';
import { APP_CONFIG } from '../_providers/AppSettingProvider';
@Injectable()
export class UtilityService {
    private customized_attrs: Array<any> = new Array<any> ();
    private date_regex = 'DD-MM-YYYY';
    constructor(@Inject(APP_CONFIG) private appSetting: any) {
        // first set up the customized attrs
        this.customized_attrs = this.appSetting.CUSTOMIZED_ATTRS;
        this.date_regex = this.appSetting.DATE_REGEX;
    }
    // sort array by multiple property
    // add '-' before the property for descending sort
    sortArrayBySingleProperty(property: string) {
        let sortOrder = 1;
      if (property[0] === '-') {
          sortOrder = -1;
          property = property.substr(1);
      }
      return (a, b) => {
        const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
      }
    }
    // sort array by multiple properties
    // add '-' before the property for descending sort
    sortArrayByMultipleProperty(vposition: string, hposition: string) {
        const props = arguments;
        return (obj1, obj2) => {
            let i = 0, result = 0;
            const numberOfProperties = props.length;
            while (result === 0 && i < numberOfProperties) {
                result = this.sortArrayBySingleProperty(props[i])(obj1, obj2);
                i++;
            };
            return result;
        }
    }
    // generate array form a number
    genArray(num: number): Array<number> {
        const array: Array<number> = [];
        if (num >= 1) {
        for (let x = 1; x <= num; x++) {
            array.push(x); }
        } else {
        array.push(1); }
        return array;
    }
    // get number from letters
    convertLetters2Integer(letters: string): number {
        const alphabeta = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
                           'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        // split letters to array
        const array = letters.toUpperCase().split('');
        let result = 0;
        for (let i = 0; i < array.length; i++) {
            result += (alphabeta.indexOf(array[i]) + 1 + alphabeta.length * i);
        }
        return result;
    }
    // number to letters
    // digit start with 1
    convertInteger2Letter(digit: number): string {
        const alphabeta = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        if (digit <= 0) {
            return '';
        } else if (digit > 0 &&  digit < 26 ) {
            return alphabeta[digit - 1 ];
        } else {
            const index: number = digit % alphabeta.length;
            const repeats: number = Math.floor(digit / alphabeta.length);
            let result = '';
            for (let i = 0; i < repeats; i++) {
                result += 'Z';
            }
            if ( index > 0) {
                result += alphabeta[index - 1];
            }
            return result;
        }
    }
    getShortMonthNames(): Array<string> {
        const short_months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return short_months;
    }
    getLongMonthNames() {
        const long_months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];
        return long_months;
    }
    getMonthNumber(month: string): number {
        const short_months = this.getShortMonthNames().map( m => m.toLowerCase());
        const long_months = this.getLongMonthNames().map( m => m.toLowerCase());
        if (short_months.indexOf(month.toLowerCase()) !== -1 ) {
            return short_months.indexOf(month.toLowerCase()) + 1;
        } else  if (long_months.indexOf(month.toLowerCase()) !== -1) {
            return long_months.indexOf(month.toLowerCase()) + 1;
        } else {
            return -1;
        }
    }
    removeSpecialCharacters(string2Remove: string) {
        return string2Remove.replace(/[`!<>\{\}\[\]\\\/]/gi, ''); // remove al special chars

        // return string2Remove.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''); // remove al special chars
    }
    getTodayFormat(): string {
        const today = new Date();
        let dd = today.getDate() + '';
        let mm = (today.getMonth() + 1) + ''; // January is 0!
        const yyyy = today.getFullYear();

        if (+dd < 10) {
            dd = '0' + dd
        }
        if (+mm < 10) {
            mm = '0' + mm
        }
        return yyyy + '-' + mm + '-' + dd;
    }
    isSpaceCheck(string2Check: string): boolean {
        return string2Check.replace(/\s/g, '').length === 0;
    }
    convert2Float(number2Format: string, max_digits: number, decimal_places: number): number {
        if (!isNaN(+number2Format)) {
            let number2Format_string = number2Format  + '';
            let symbol = '';
            if (number2Format_string.startsWith('+')) {
                symbol = '+';
                number2Format_string = number2Format_string.substring(1)
            }
            if (number2Format_string.startsWith('-')) {
                symbol = '-';
                number2Format_string = number2Format_string.substring(1)
            }
            if (number2Format_string.indexOf('.') === -1) {
                if (number2Format_string.length <= max_digits) {
                    return +number2Format;
                }
            } else {
                const fArray = number2Format_string.split('.');
                if ((fArray[0] + '').length <= max_digits) {
                    const right_len = max_digits - (fArray[0] + '').length;
                    if (right_len <= decimal_places) {
                        return +number2Format;
                    } else {
                        const res = symbol + (fArray[0] + '') + '.' + (fArray[1] + '').substring(0, decimal_places);
                        return +res;
                    }
                }
            }
        }
        return null;
    }
    convert2Integer(number2Format: string) {
        if (!isNaN(+number2Format)) {
            let number2Format_string = number2Format  + '';
            if (number2Format_string.indexOf('.') !== -1) {
                const fArray = number2Format_string.split('.');
                number2Format_string = fArray[0];
                return +number2Format_string;
            } else {
                return +number2Format;
            }
        }
        return null;
    }
    getSamplePostion(sample_label: number, box_horizontal: number) {
        const d = {};
        const s_vposition_index = Math.floor (+sample_label / box_horizontal );
        const s_hposiiton_index = +sample_label % box_horizontal;
        // get v/h positions
        if (s_vposition_index === 0 && s_hposiiton_index === 0) {
          d['vposition'] = 'A';
          d['hposition'] = 1;
        } else if (s_vposition_index === 0 && s_hposiiton_index > 0) {
          // first row
          // no A8
          d['vposition'] = this.convertInteger2Letter (1);
          d['hposition'] = s_hposiiton_index;
        } else if (s_vposition_index > 0 && s_hposiiton_index === 0) {
          // first row
          d['vposition'] = this.convertInteger2Letter (s_vposition_index);
          d['hposition'] = box_horizontal;
        } else {
          d['vposition'] = this.convertInteger2Letter (s_vposition_index + 1);
          d['hposition'] = s_hposiiton_index;
        }
        return d;
    }
    getBoxPostion(sample_label: number, max_sample_count: number, all_containerboxes: Array<Array<number>>): Array<any> {
        const b_index = Math.floor ( +sample_label / max_sample_count );
        const b_index_remainder = +sample_label % max_sample_count;
        let box_position: Array<number> = [];
        if (b_index === 0 && b_index_remainder === 0) {
          box_position = all_containerboxes[0];
        } else if (b_index === 0 && b_index_remainder > 0) {
          box_position = all_containerboxes[0];
        } else if (b_index > 0 && b_index_remainder === 0) {
          box_position = all_containerboxes[ b_index - 1 ];
        } else {
          box_position = all_containerboxes[ b_index ];
        }
        return box_position;
    }
    // render sample name
    renderSampleName(sampleName: string, show_original_name: boolean,
        min_length = 15, right_length = 10, symbol = '...') {
        let name = sampleName;
        if (!show_original_name && sampleName.length > min_length) {
            if ( sampleName.length > min_length + right_length + symbol.length ) {
                name = sampleName.substring(0, min_length - 1) + symbol + sampleName.substring(sampleName.length - right_length);
            } else {
                name = sampleName.substring(0, min_length - 1) + symbol;
            }
        }
        return name;
    }
    // print all the values of an object
    convertObj2String(obj: any): string {
        let res = ''
        const keys = Object.keys(obj);
        for (const key of keys) {
            if (obj[key] != null) {
                if ( typeof obj[key] === 'object' ) {
                    res += this.convertObj2String(obj[key]);
                } else {
                    res += obj[key].toString();
                }
            }
        }
        return res;
    }
    getCustomizedSampleAttrLabel(name: string, customized_attrs = this.customized_attrs) {
        let label = '';
        const attr = customized_attrs.find((a: any) => {
            return a.name === name;
        });
        label = attr !== undefined ? attr.label : name.toUpperCase();
        return label;
    }
    getCustomizedSampleAttachmentAttrLabel(name: string, customized_attrs = this.customized_attrs) {
        let label = '';
        const attr = customized_attrs.find((a: any) => {
            return a.name === 'attachments';
        });
        if (attr !== undefined) {
            const subattr = attr.subattrs.find((sa: any) => {
                return sa.name === name;
            });
            label = subattr !== undefined ? subattr.label : name;
        } else {
            label = name;
        }
        return label;
    }
    // decode ctype input type
    decodeCTypeAttrType(attr_value_type: number): string {
        let decoded: string;
        if (+attr_value_type === 0) {
            decoded = 'text';
        } else if (+attr_value_type === 1 || +attr_value_type === 2) {
            decoded = 'number';
        } else if (+attr_value_type === 4) {
            decoded = 'date';
        } else {
            decoded = 'text';
        }
        return decoded;
    }
    // get ctype attr input decimal step
    decodeCTypeDigitStep(attr_value_type: number, decimal_point: number): number {
        let step = 0.01;
        if ( attr_value_type === 2) {
            step = 1 / (10 * decimal_point);
        }
        return step
    }
    // decodeCTPyeInputAttr
    decodeCTPyeInputAttr(attr: CTypeAttr | CTypeSubAttr) {
        const obj = {};
        // input type
        obj['type'] = this.decodeCTypeAttrType(+attr.attr_value_type);
        // required or not
        obj['required'] = attr.attr_required;
        // max for string
        if (+attr.attr_value_type === 0
            && attr.attr_value_text_max_length !== null
            && !isNaN(+attr.attr_value_text_max_length)
            && +attr.attr_value_text_max_length > 0
            ) {
            obj['maxlength'] = +attr.attr_value_text_max_length;
        } else {
            obj['maxlength'] = null;
        }
        // step for float/decimal
        if (+attr.attr_value_type === 2) {
            if (attr.attr_value_decimal_point !== null
                && !isNaN(+attr.attr_value_decimal_point)
                && +attr.attr_value_decimal_point > 0) {
                    obj['step'] = this.decodeCTypeDigitStep(+attr.attr_value_type, +attr.attr_value_decimal_point);
                } else {
                    obj['step'] = 0.01;
                }
        } else {
            obj['step'] = null;
        }
        return obj;
    }
    // validation for edit sample attr or subattr
    preSaveSampleDataValidation(value: any, attr: MCTypeAttr | MCTypeSubAttr) {
        // if have sub attr, skip
        if (+attr.attr_value_type === 3) {
            return '';
        }
        let msg = '';
        if (attr.attr_required && (value === undefined || value === null || value === '')) {
            msg = attr.attr_label + ' is required!';
            return msg;
        }
        if (+attr.attr_value_type === 0 ) {
            // string
            if (attr.attr_value_text_max_length !== null && value.length > attr.attr_value_text_max_length) {
                msg = attr.attr_label + ' is too long!';
                return msg;
            }
        } else if (+attr.attr_value_type === 1) {
            // digit
            if (isNaN(+value) || +value.toString().indexOf('.') !== -1) {
                msg = attr.attr_label + ' is invalid!';
                return msg;
            }
        } else if (+attr.attr_value_type === 2) {
            // float
            const total_digit = +attr.attr_value_decimal_total_digit || 5;
            const decimal_point = +attr.attr_value_decimal_point || 2;
            const is_postive = true;
            if (isNaN(+value)
            || (is_postive && +value < 0)
            || (!is_postive && +value >= 0)
            || (value.toString().indexOf('.') === -1 || total_digit <= decimal_point)) {
                msg = attr.attr_label + ' is invalid!';
                return msg;
            }
            const array = value.toString().split('.');
            if (array.length !== 2
            || array[0].length + array[1].length > total_digit
            || array[1].length > decimal_point
                ) {
                    msg = attr.attr_label + ' is invalid!';
                return msg;
                }
            if (value.toString().length  - 1 > total_digit) {
                msg = attr.attr_label + ' is invalid!';
                return msg;
            }
        } else {
            // date
            msg = '';
        }
        return msg;
    }
    // check whether all the subattr field is valid
    checkSampleTotalSubDataValidation (add_subattr_data: Array<any>, table_attrs: Array<MCSubAttrData>) {
        const parent_attr_pk = table_attrs[0].sub_attr.parent_attr_id;
        let is_valid = true;
        table_attrs.forEach((item: MCSubAttrData) => {
            const data_item = add_subattr_data.find((data: any) => {
                return data.parent_attr_id === parent_attr_pk && data.subattr_pk === item.sub_attr.pk;
            })
            if (data_item === undefined) {
                is_valid = false;
            }
            if (item.sub_attr.attr_required && (data_item.value === null || data_item === '')) {
                is_valid = false;
            } else {
                const validation = this.preSaveSampleDataValidation(data_item.value, item.sub_attr);
                if (validation !== '') {
                    is_valid =  false;
                }
            }
        })
        return is_valid;
    }
}
