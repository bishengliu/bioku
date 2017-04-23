import { CustomFormValidators } from '../_helpers/CustomFormValidators'

export var CustomFormValidatorsProvider: Array<any> = [
        {provide: CustomFormValidators, useClass: CustomFormValidators},
        
    ];