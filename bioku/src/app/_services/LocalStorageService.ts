import { Injectable } from '@angular/core';
import { BoxAvailability } from '../_classes/ContainerTower';


@Injectable()
export class LocalStorageService
{
    boxAvailabilities: Array<BoxAvailability>;
    lastSelectedOccupiedBox: string;
    selectedOccupiedSlots: Array<BoxAvailability>;
    selectedEmptySlots: Array<BoxAvailability>;
}