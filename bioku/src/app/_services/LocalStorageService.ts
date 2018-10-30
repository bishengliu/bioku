import { Injectable } from '@angular/core';
import { BoxAvailability } from '../_classes/ContainerTower';
import { Sample } from '../_classes/Sample';
import { Container } from '../_classes/Container';
import { Box } from '../_classes/Box';
import { CSample } from '../_classes/CType';
@Injectable()
export class LocalStorageService {
    // boxes
    boxAvailabilities: Array<BoxAvailability>;
    lastSelectedOccupiedBox: string;
    selectedOccupiedSlots: Array<BoxAvailability>;
    selectedEmptySlots: Array<BoxAvailability>;

    // samples
    singleSample: Sample | CSample;
    occupiedSamples: Array<Sample> | Array<CSample>;
    preoccupiedSamples: Array<Sample> | Array<CSample>;
    allCellsSelected: Array<string>;
    emptySelectedCells: Array<string>;
    curContainer: Container; // current container
    curBox: Box; // current box
}
