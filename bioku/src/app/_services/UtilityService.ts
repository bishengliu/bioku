import { Injectable , Inject} from '@angular/core';
import { digest } from '@angular/compiler/src/i18n/serializers/xmb';

@Injectable()
export class UtilityService {
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
}
