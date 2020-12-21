import { GridType } from './Grid';

export abstract class SudokuDsl {
    public static getHorizontalRowByRowIndex(grid: GridType, index: number): GridType {
        const gridCopy = JSON.parse(JSON.stringify(grid)) as GridType;
        const startIndex = index * 9;
        return gridCopy.slice(startIndex, startIndex + 9);
    }

    public static getVerticalRowByRowIndex(grid: GridType, index: number): GridType {
        const gridCopy = JSON.parse(JSON.stringify(grid)) as GridType;

        return gridCopy.filter((_, i) => i % 9 === index);
    }

    public static getSubgridBySubgridIndex(grid: GridType, index: number): GridType {
        const gridCopy = JSON.parse(JSON.stringify(grid)) as GridType;
        
        return gridCopy.filter(x => x.subgrid === index);
    }

    public static getHorizontalNeighboursByCellIndex(grid: GridType, index: number): GridType {
        const rowIndex = Math.floor(index / 9);
        const row = SudokuDsl.getHorizontalRowByRowIndex(grid, rowIndex);  
   
        return SudokuDsl.getNeighbours(grid, row, index);
    }

    public static getVerticalNeighboursByCellIndex(grid: GridType, index: number): GridType {
        const rowIndex = Math.floor(index % 9);
        const row = SudokuDsl.getVerticalRowByRowIndex(grid, rowIndex);

        return SudokuDsl.getNeighbours(grid, row, index);
    }

    public static getSubgridNeighboursByCellIndex(grid: GridType, index: number): GridType {
        const row = SudokuDsl.getSubgridBySubgridIndex(grid, grid[index].subgrid);

        return SudokuDsl.getNeighbours(grid, row, index);
    }

    private static getNeighbours(grid: GridType, row: GridType, index: number): GridType {
        if (grid[index].value) {
            row = row.filter(x => x.value !== grid[index].value);
        }

        return row.filter(x => !!x.value);
    } 
}