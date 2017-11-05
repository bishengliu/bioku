import { Injectable , Inject} from '@angular/core';

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
}
