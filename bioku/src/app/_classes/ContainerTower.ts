//class for checking the availibility of a container

export class BoxAvailability{
    position: number;
    available: boolean;
    full_position: string
}

export class Containershelf {
    shelf: number;
    boxAvailabilities: Array<BoxAvailability>;
}

export class ContainerTower {
    tower: number;
    shelves: Array<Containershelf>;
}

