import { SudokuDsl } from './SudokuDsl';
import { GridItem, GridType } from './Grid';
import uniq from 'lodash/uniq';
import without from 'lodash/without';
import { SudokuState } from './State';

enum UpdateDirection {
    PREVIOUS,
    NEXT
}

type MachinePromise = {
    progress: (state: SudokuState) => void,
    resolve: (value: any) => void;
    reject: (value: any) => void;
};

export class Machine {
    private grid: GridType;
    private cycles: number = 0;
    private readonly maxCycles: number = 10000;
    private fillableIndexes: number[];
    private timerStart: number;
    private timerEnd: number;


    constructor(grid: GridType) {
        this.grid = grid;
        this.fillableIndexes = this.getFillableIndexes();
    }

    public run(progress: (state: SudokuState) => void) {
        this.timerStart = performance.now();

        return new Promise((resolve, reject) => {
            // Get first empty cell, kickoff!
            const firstContenderIndex = this.grid.findIndex(x => !x.isStaticValue);
            this.updateCell(firstContenderIndex, UpdateDirection.NEXT, {
                progress,
                resolve,
                reject
            });
        });
    }

    public populateMetaDataByIndex(cellIndex: number, direction: UpdateDirection = UpdateDirection.NEXT): GridItem {
        let cell = this.grid[cellIndex];
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

        return cell;
    }

    private updateCell(cellIndex: number, direction: UpdateDirection, promise?: MachinePromise) {
        if (this.cycles === this.maxCycles) {
            return;
        }

        this.grid[cellIndex] = this.populateMetaDataByIndex(cellIndex, direction);
        if (promise) {
            promise.progress({
                grid: this.grid,
                cycles: this.cycles
            });
        }
        this.cycles++;

        // Loop as long the cell is still in the grid
        if (this.getNextCell(cellIndex) !== -1) {
            // Added setTimeout in order to make things visible on the front-end. Otherwise it will show after calculating it all. 
            // setTimeout(() => {
                // If there are still possible valid values, continue on to the next cell
                if (this.grid[cellIndex].possibleValidValues.length > 0) {
                    this.updateCell(this.getNextCell(cellIndex), UpdateDirection.NEXT, promise);
                    // If there are no possible values, return to the previous cell to try another value
                } else {
                    this.updateCell(this.getPreviousCell(cellIndex), UpdateDirection.PREVIOUS, promise);
                }
            // });
        } else {
            console.log('finished!');
            this.timerEnd = performance.now();
            console.log(`Took ${(this.timerEnd - this.timerStart)} milliseconds.`);

            if (promise) {
                promise.resolve(1);
            }
        }
    }

    private populateMetaDataByNeighbours(cell: GridItem, neighbours: GridType): GridItem {
        const neighbourStaticValues = neighbours
            .filter(x => x.value)
            .map(x => x.value);

        // Make sure to exclude all neighbour values, as they can't be filled in again
        cell.invalidValues = uniq(cell.invalidValues.concat(neighbourStaticValues));
        cell.possibleValidValues = without([1, 2, 3, 4, 5, 6, 7, 8, 9], ...cell.invalidValues);

        return cell;
    }

    private getNextCell(fromIndex: number): number {
        const indexList = this.fillableIndexes;
        const currentIndex = indexList.indexOf(fromIndex);
        const nextIndex = indexList[currentIndex + 1];

        return nextIndex || -1;
    }

    private getPreviousCell(fromIndex: number): number {
        const indexList = this.fillableIndexes;
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