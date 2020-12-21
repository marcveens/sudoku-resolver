import { QueryString } from '../utils/QueryString';
import { StartGrid } from './Sudoku';

export class GridItem {
    value?: number;
    isStaticValue: boolean = false;
    possibleValidValues: number[] = [];
    invalidValues: number[] = [];
    subgrid: number = 0;

    constructor(v?: GridItem) {
        if (v) {
            this.value = v.value;
            this.isStaticValue = v.isStaticValue;
            this.possibleValidValues = v.possibleValidValues;
            this.invalidValues = v.invalidValues;
            this.subgrid = v.subgrid;
        }
    }
};

export type GridType = GridItem[];

export class Grid {
    private maxCells = 9 * 9;

    public create(startGrid: string): GridType {
        const parsedStartGrid = QueryString.getParsed<StartGrid>(startGrid);
        const grid: GridType = [];
        let rowCount = 1;
        let cellCount = 1;
        let rowSection = 1;
        let subgrid = 1;


        for (let i = 0; i < this.maxCells; i++) {
            grid[i] = new GridItem();
            grid[i].subgrid = subgrid - 1;

            if (cellCount % 3 === 0) {
                subgrid++;
            }

            if (cellCount % 9 === 0) {
                subgrid = rowSection;
                rowCount++;

                if (rowCount % 3 === 0) {
                    rowSection = rowSection + 3;
                }
            }
            
            cellCount++;

            if (parsedStartGrid[i]) {
                grid[i].isStaticValue = true;
                grid[i].value = Number(parsedStartGrid[i]);
            }
        }

        return grid;
    }
}