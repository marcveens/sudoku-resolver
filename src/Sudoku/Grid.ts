import { QueryString } from '../utils/QueryString';
import { StartGrid } from './Sudoku';

class GridItem {
    value: number | undefined;
    isStaticValue: boolean = false;
    possibleValidValues: number[] = [];
    invalidValues: number[] = [];
};

export type GridType = GridItem[];

export class Grid {
    private maxCells = 9 * 9;

    public createGrid(startGrid: string): GridType {
        const parsedStartGrid = QueryString.getParsed<StartGrid>(startGrid);
        const grid: GridType = [];
        
        for (let i = 0; i < this.maxCells; i++) {
            grid[i] = new GridItem();
            
            if (parsedStartGrid[i]) {
                grid[i].isStaticValue = true;
                grid[i].value = Number(parsedStartGrid[i]);
            }
        }

        return grid;
    }
}