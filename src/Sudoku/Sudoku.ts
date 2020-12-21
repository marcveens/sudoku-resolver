import { Grid } from './Grid';
import { Machine } from './Machine';
import { Validator } from './Validator';

export type StartGrid = { [key: number]: string };

export class Sudoku {
    grid: Grid;
    validator: Validator;
    machine: Machine;

    constructor(startGrid: string) {
        this.grid = new Grid();
        this.validator = new Validator();

        try {
            this.validator.validateStartGrid(startGrid);
        } catch (e) {
            console.error(e);
            return;
        }

        const grid = this.grid.create(startGrid);
        this.machine = new Machine(grid);
    }
    
    run() {
        this.machine.run();        
    }
}