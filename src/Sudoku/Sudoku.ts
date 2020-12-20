import { Grid } from './Grid';
import { Validator } from './Validator';

export type StartGrid = { [key: number]: string };

export class Sudoku {
    grid: Grid;
    validator: Validator;

    constructor(startGrid: string) {
        this.grid = new Grid();
        this.validator = new Validator();

        try {
            this.validator.validateStartGrid(startGrid);
        } catch (e) {
            console.error(e);
            return;
        }

        this.grid.createGrid(startGrid);
    }
}