import { createStore } from '@stencil/store';
import { GridType } from './Grid';

export type SudokuState = {
    grid: GridType;
};

export const { state, onChange } = createStore<SudokuState>({
    grid: []
});
