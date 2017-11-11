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
            result += (alphabeta.indexOf(array[i]) + 1);
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
            console.log([repeats, index])
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
}
