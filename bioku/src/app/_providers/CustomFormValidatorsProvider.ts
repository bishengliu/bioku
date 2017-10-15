import { CustomFormValidators } from '../_helpers/CustomFormValidators'

export const CustomFormValidatorsProvider: Array<any> = [
        {provide: CustomFormValidators, useClass: CustomFormValidators},
    ];
