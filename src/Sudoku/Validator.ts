import { QueryString } from '../utils/QueryString';
import { SudokuDsl } from './SudokuDsl';
import { GridType } from './Grid';
import { StartGrid } from './Sudoku';

export class Validator {
    private rowLength = 9;
    private maxCells = this.rowLength * this.rowLength;
    private totalRowValue = 45;
    private maxCellValue = 9;
    private minCellValue = 1;

    public validateStartGrid(startGrid: string) {
        try {
            const parsedStartGrid = QueryString.getParsed<StartGrid>(startGrid);
            const exceedsMaxCells = Object.keys(parsedStartGrid).length > this.maxCells;
            const exceedsMaxCellKey = !Object.keys(parsedStartGrid).reduce<boolean>((isValid, key) => this.maxValueReducer(isValid, key, this.maxCells - 1), true);
            const exceedsMaxCellValue = !Object.values(parsedStartGrid).reduce<boolean>((isValid, key) => this.maxValueReducer(isValid, key, this.maxCellValue, this.minCellValue), true);

            if (exceedsMaxCells) {
                throw new Error('More than 81 cell values provided');
            }

            if (exceedsMaxCellKey) {
                throw new Error('No key may exceed 81 and should be a valid number');
            }

            if (exceedsMaxCellValue) {
                throw new Error('No value may exceed 9 or be less than 1 and should be a valid number');
            }
        } catch (e) {
            throw e;
        }
    }

    public validateGrid(grid: GridType) {
        try {
            this.validateHorizontalRows(grid);
            this.validateVerticalRows(grid);
            // this.validateSubgrids(grid);
        } catch (e) {
            throw e;
        }
    }

    public validateHorizontalRows(grid: GridType) {
        try {
            for (let i = 0; i < this.rowLength; i++) {
                const values = SudokuDsl.getHorizontalRowByIndex(grid, i);
                if (values.map(x => x.value).reduce(this.rowReducer) !== this.totalRowValue) {
                    throw new Error(`Invalid horizontal row found, index ${i}`);
                }
            }
        } catch (e) {
            throw e;
        }
    }

    public validateVerticalRows(grid: GridType) {
        try {
            for (let i = 0; i < this.rowLength; i++) {
                const values = SudokuDsl.getVerticalRowByIndex(grid, i);
                if (values.map(x => x.value).reduce(this.rowReducer) !== this.totalRowValue) {
                    throw new Error(`Invalid vertical row found, index ${i}`);
                }
            }
        } catch (e) {
            throw e;
        }
    }    
    
    // public validateSubgrids(grid: GridType) {
    //     try {
    //         for (let i = 0; i < this.rowLength; i++) {
    //             const values = SudokuDsl.getSubgridByIndex(grid, i);
    //             if (values.map(x => x.value).reduce(this.rowReducer) !== this.totalRowValue) {
    //                 throw new Error(`Invalid subgrid found, index ${i}`);
    //             }
    //         }
    //     } catch (e) {
    //         throw e;
    //     }
    // }

    private rowReducer(accumulator, currentValue) {
        return accumulator + currentValue;
     }

    private maxValueReducer(isValid: boolean, value: string, maxValue: number, minValue: number = 0) {
        if (!isValid) {
            return isValid;
        }

        if (Number(value) !== NaN) {
            isValid = Number(value) <= maxValue && Number(value) >= minValue;
        } else {
            isValid = false;
        }

        return isValid;
    }
}