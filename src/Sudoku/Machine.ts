import { SudokuDsl } from './SudokuDsl';
import { GridItem, GridType } from './Grid';
import uniq from 'lodash/uniq';
import without from 'lodash/without';
import { state } from './State';

enum UpdateDirection {
    PREVIOUS,
    NEXT
}

export class Machine {
    private grid: GridType;
    private cycles: number = 0;
    private readonly maxCycles: number = 10000;

    constructor(grid: GridType) {
        this.grid = grid;
        this.emitUpdate();
    }

    emitUpdate() {
        state.grid = [...this.grid];
        state.cycles = this.cycles;
    };

    public run() {

        this.emitUpdate();

        const firstContenderIndex = this.grid.findIndex(x => !x.isStaticValue);
        this.updateCell(firstContenderIndex, UpdateDirection.NEXT);

        console.log(this.getNextCell(2));

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


    }

    public populateMetaDataByIndex(cellIndex: number, direction: UpdateDirection = UpdateDirection.NEXT): GridItem {
        let cell = JSON.parse(JSON.stringify(this.grid[cellIndex])) as GridItem;
        const horizontalNeighbours = SudokuDsl.getHorizontalNeighboursByCellIndex(this.grid, cellIndex);
        const verticalNeighbours = SudokuDsl.getVerticalNeighboursByCellIndex(this.grid, cellIndex);
        const subgridNeighbours = SudokuDsl.getSubgridNeighboursByCellIndex(this.grid, cellIndex);

        if (direction === UpdateDirection.PREVIOUS) {
            if (cell.possibleValidValues.includes(cell.value)) {
                cell.invalidValues.push(cell.value);
                cell.possibleValidValues = without(cell.possibleValidValues, cell.value);
            }
        } else if (direction === UpdateDirection.NEXT) {
            cell.invalidValues = [];
        }

        cell = this.populateMetaDataByNeighbours(cell, horizontalNeighbours);
        cell = this.populateMetaDataByNeighbours(cell, verticalNeighbours);
        cell = this.populateMetaDataByNeighbours(cell, subgridNeighbours);

        cell.value = cell.possibleValidValues[0];

        // console.log(cellIndex, cell.possibleValidValues);

        return cell;
    }

    private updateCell(cellIndex: number, direction: UpdateDirection) {
        if (this.cycles === this.maxCycles) {
            return;
        }

        this.grid[cellIndex] = this.populateMetaDataByIndex(cellIndex, direction);
        this.emitUpdate();
        this.cycles++;

        if (this.getNextCell(cellIndex) !== -1) {
            setTimeout(() => {
                if (this.grid[cellIndex].possibleValidValues.length > 0) {
                    this.updateCell(this.getNextCell(cellIndex), UpdateDirection.NEXT);
                } else {
                    this.updateCell(this.getPreviousCell(cellIndex), UpdateDirection.PREVIOUS);
                }
            });
        }
    }

    private populateMetaDataByNeighbours(cell: GridItem, neighbours: GridType): GridItem {
        const neighbourStaticValues = neighbours
            .filter(x => x.value)
            .map(x => x.value);

        cell.invalidValues = uniq(cell.invalidValues.concat(neighbourStaticValues));
        cell.possibleValidValues = without([1, 2, 3, 4, 5, 6, 7, 8, 9], ...cell.invalidValues);

        return cell;
    }

    private getNextCell(fromIndex: number): number {
        const indexList = this.getFillableIndexes();
        const currentIndex = indexList.indexOf(fromIndex);
        const nextIndex = indexList[currentIndex + 1];

        return nextIndex || -1;
    }

    private getPreviousCell(fromIndex: number): number {
        const indexList = this.getFillableIndexes();
        const currentIndex = indexList.indexOf(fromIndex);
        const nextIndex = indexList[currentIndex - 1];

        return nextIndex || -1;
    }

    private getFillableIndexes() {
        const indexList: number[] = [];
        this.grid.forEach((item, index) => {
            if (!item.isStaticValue) {
                indexList.push(index);
            }
        });

        return indexList;
    }
}