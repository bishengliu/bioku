import { Injectable } from '@angular/core';
import { BoxAvailability } from '../_classes/ContainerTower';
import { Sample } from '../_classes/Sample';
import { Container } from '../_classes/Container';
import { Box } from '../_classes/Box';

@Injectable()
export class LocalStorageService
{
    //boxes
    boxAvailabilities: Array<BoxAvailability>;
    lastSelectedOccupiedBox: string;
    selectedOccupiedSlots: Array<BoxAvailability>;
    selectedEmptySlots: Array<BoxAvailability>;

    //samples
    singleSample: Sample;
    occupiedSamples: Array<Sample>;
    preoccupiedSamples: Array<Sample>;
    allCellsSelected: Array<string>;
    emptySelectedCells: Array<string>;
    curContainer: Container; //current container
    curBox: Box; //current box
}