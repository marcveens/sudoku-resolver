import { GridType } from './Sudoku/Grid';
import { Machine } from './Sudoku/Machine';
import { SudokuState } from './Sudoku/State';

export const solveSudoku = async (grid: GridType, progress: (state: SudokuState) => void) => {
    const machine = new Machine(grid);

    return new Promise((resolve, reject) => {
        machine.run(progress).then(resolve).then(reject);
    });
}