import { createStore } from '@stencil/store';
import { GridType } from './Grid';

export type SudokuState = {
    grid: GridType;
    cycles: number;
};

export const { state, onChange } = createStore<SudokuState>({
    grid: [],
    cycles: 0,
});
