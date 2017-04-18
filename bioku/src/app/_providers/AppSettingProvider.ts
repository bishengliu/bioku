import { AppSetting} from '../_config/AppSetting';
import {InjectionToken} from '@angular/core';

export let APP_CONFIG = new InjectionToken<Object>("root-config");

export var AppSettingProvider = {provide: APP_CONFIG, useValue: AppSetting};
