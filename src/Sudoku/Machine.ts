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
    private readonly maxCycles: number = 40000000;
    private timerStart: number;
    private timerEnd: number;

    constructor(grid: GridType) {
        this.grid = grid;
    }

    public run(progress: (state: SudokuState) => void) {
        this.timerStart = performance.now();

        return new Promise((resolve, reject) => {
            // Get first empty cell, kickoff!
            const firstContenderIndex = this.getFillableIndexes()[0];
            this.setInevitableValues(progress);
            const updateCellKickoff = this.trampoline(this.updateCell);

            updateCellKickoff(firstContenderIndex, UpdateDirection.NEXT, {
                progress,
                resolve,
                reject
            });
        });
    }

    public populateMetaDataByIndex(cellIndex: number, direction: UpdateDirection = UpdateDirection.NEXT, setValue = true): GridItem {
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

        if (setValue) {
            cell.value = cell.possibleValidValues[0];
        }

        return cell;
    }

    private setInevitableValues(progress: (state: SudokuState) => void) {
        let inevitablesFound = 0;

        this.getFillableIndexes().forEach(index => {
            this.grid[index] = this.populateMetaDataByIndex(index, UpdateDirection.NEXT, false);

            if (this.grid[index].possibleValidValues.length === 1 && !this.grid[index].guaranteedValue) {
                this.grid[index].value = this.grid[index].possibleValidValues[0];
                this.grid[index].guaranteedValue = true;
                this.cycles++;
                inevitablesFound++;
            }
        });

        progress({
            grid: this.grid,
            cycles: this.cycles
        });

        if (inevitablesFound) {
            this.setInevitableValues(progress);
        }
    }

    private updateCell(cellIndex: number, direction: UpdateDirection, promise?: MachinePromise) {
        if (this.cycles === this.maxCycles) {
            return;
        }

        if (cellIndex === -1 && promise) {
            promise.reject(`Sudoku is invalid`);
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
            // If there are still possible valid values, continue on to the next cell
            if (this.grid[cellIndex].possibleValidValues.length > 0) {
                return () => this.updateCell(this.getNextCell(cellIndex), UpdateDirection.NEXT, promise);
                // If there are no possible values, return to the previous cell to try another value
            } else {
                return () => this.updateCell(this.getPreviousCell(cellIndex), UpdateDirection.PREVIOUS, promise);
            }
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
            if (!item.isStaticValue && !item.guaranteedValue) {
                indexList.push(index);
            }
        });

        return indexList;
    }

    // See https://blog.logrocket.com/using-trampolines-to-manage-large-recursive-loops-in-javascript-d8c9db095ae3/
    private trampoline = fn => (...args) => {
        fn = fn.bind(this);
        let result = fn(...args);
        while (typeof result === 'function') {
            result = result();
        }
        return result;
    }
}