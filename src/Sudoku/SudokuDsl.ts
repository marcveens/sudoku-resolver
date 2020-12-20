import { GridType } from './Grid';

export abstract class SudokuDsl {
    public static getHorizontalRowByIndex(grid: GridType, index: number): GridType {
        const gridCopy = JSON.parse(JSON.stringify(grid)) as GridType;
        const startIndex = index * 9;
        return gridCopy.slice(startIndex, startIndex + 9);
    }

    public static getVerticalRowByIndex(grid: GridType, index: number): GridType {
        const gridCopy = JSON.parse(JSON.stringify(grid)) as GridType;

        return gridCopy.filter((_, i) => i % 9 === index);
    }

    public static getSubgridByIndex(grid: GridType, index: number): GridType {
        const gridCopy = JSON.parse(JSON.stringify(grid)) as GridType;
        
        return gridCopy.filter(x => x.subgrid === index);
    }
}