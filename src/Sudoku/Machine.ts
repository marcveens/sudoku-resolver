import { SudokuDsl } from './SudokuDsl';
import { GridItem, GridType } from './Grid';
import uniq from 'lodash/uniq';
import without from 'lodash/without';
import { state } from './State';

export class Machine {
    private grid: GridType;
    private cycles: number = 1;
    private readonly maxCycles: number = 10;

    constructor(grid: GridType) {
        this.grid = grid;
    }

    public run() {
        if (this.cycles === this.maxCycles) {
            return;
        }

        const emitUpdate = () => {
            state.grid = [...this.grid];
        };

        const firstContenderIndex = this.grid.findIndex(x => !x.isStaticValue);
        
        emitUpdate();
        
        setTimeout(() => {
            this.grid[firstContenderIndex] = this.populateMetaDataByIndex(firstContenderIndex);
            emitUpdate();
        }, 2000);





        /*
            1. For each cell
                - Check all possible values
                    - Which value is available horizontally?
                    - ... vertically?
                    - in subgrid?
                - Register impossible values so they will never have to be run through
            2. Loop until no value is possible
            3. Check previous cell if other value is possible
                - If so
                    - Try other value and continue
                - If not 
                    - Go back another cell and try again
        */


        this.cycles++;
    }

    public populateMetaDataByIndex(cellIndex: number): GridItem {
        let cell = JSON.parse(JSON.stringify(this.grid[cellIndex])) as GridItem;
        const horizontalNeighbours = SudokuDsl.getHorizontalNeighboursByCellIndex(this.grid, cellIndex);
        const verticalNeighbours = SudokuDsl.getVerticalNeighboursByCellIndex(this.grid, cellIndex);
        const subgridNeighbours = SudokuDsl.getSubgridNeighboursByCellIndex(this.grid, cellIndex);

        cell = this.populateMetaDataByNeighbours(cell, horizontalNeighbours);
        cell = this.populateMetaDataByNeighbours(cell, verticalNeighbours);
        cell = this.populateMetaDataByNeighbours(cell, subgridNeighbours);

        return cell;
    }

    private populateMetaDataByNeighbours(cell: GridItem, neighbours: GridType): GridItem {
        const neighbourStaticValues = neighbours
            .filter(x => x.isStaticValue)
            .map(x => x.value);

        cell.invalidValues = uniq(cell.invalidValues.concat(neighbourStaticValues));
        cell.possibleValidValues = without([1, 2, 3, 4, 5, 6, 7, 8, 9], ...cell.invalidValues);

        return cell;
    }
}