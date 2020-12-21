import { GridCreator, GridType } from './Grid';
import { Validator } from './Validator';

export type StartGrid = { [key: number]: string };

export class Sudoku {
    private grid: GridType;

    constructor(startGrid: string) {
        const gridCreator = new GridCreator();
        const validator = new Validator();

        try {
            validator.validateStartGrid(startGrid);
        } catch (e) {
            console.error(e);
            return;
        }

        this.grid = gridCreator.create(startGrid);
    }

    getGrid() {
        return this.grid;
    }
}