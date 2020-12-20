import { SudokuDsl } from '../SudokuDsl';
import solvedSudoku from './data/solvedSudoku.json';

describe('SudokuDsl', () => {
    it('should get horizontal row values by index', () => {
        // act + assert
        expect(SudokuDsl.getHorizontalRowByIndex(solvedSudoku, 2).map(x => x.value)).toStrictEqual([1, 9, 8, 3, 4, 2, 5, 6, 7]);
    });

    it('should get vertical row values by index', () => {
        // act + assert
        expect(SudokuDsl.getVerticalRowByIndex(solvedSudoku, 5).map(x => x.value)).toStrictEqual([8, 5, 2, 1, 3, 4, 7, 9, 6]);
    });

    // it('should get subgrid values by index', () => {
    //     // act + assert
    //     expect(SudokuDsl.getSubgridByIndex(solvedSudoku, 5).map(x => x.value)).toStrictEqual([7, 6, 1, 8, 5, 3, 9, 2, 4]);
    // });
});