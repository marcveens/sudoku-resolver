import { SudokuDsl } from '../SudokuDsl';
import solvedSudoku from './data/solvedSudoku.json';
import generatedGrid from './data/generatedGrid.json';

describe('SudokuDsl', () => {
    it('should get horizontal row values by row index', () => {
        // act + assert
        expect(SudokuDsl.getHorizontalRowByRowIndex(solvedSudoku, 2).map(x => x.value)).toStrictEqual([1, 9, 8, 3, 4, 2, 5, 6, 7]);
    });

    it('should get vertical row values by row index', () => {
        // act + assert
        expect(SudokuDsl.getVerticalRowByRowIndex(solvedSudoku, 5).map(x => x.value)).toStrictEqual([8, 5, 2, 1, 3, 4, 7, 9, 6]);
    });

    it('should get subgrid values by subgrid index', () => {
        // act + assert
        expect(SudokuDsl.getSubgridBySubgridIndex(solvedSudoku, 4).map(x => x.value)).toStrictEqual([7, 6, 1, 8, 5, 3, 9, 2, 4]);
    });

    it('should get horizontal neighbours by cell index', () => {
        // act + assert
        expect(SudokuDsl.getHorizontalNeighboursByCellIndex(generatedGrid, 2).map(x => x.value)).toStrictEqual([5, 3, 7]);
        expect(SudokuDsl.getHorizontalNeighboursByCellIndex(generatedGrid, 9).map(x => x.value)).toStrictEqual([1, 9, 5]);
    });

    it('should get vertical neighbours by cell index', () => {
        // act + assert
        expect(SudokuDsl.getVerticalNeighboursByCellIndex(generatedGrid, 2).map(x => x.value)).toStrictEqual([8]);
        expect(SudokuDsl.getVerticalNeighboursByCellIndex(generatedGrid, 9).map(x => x.value)).toStrictEqual([5, 8, 4, 7]);
    });

    it('should get subgrid neighbours by cell index', () => {
        // act + assert
        expect(SudokuDsl.getSubgridNeighboursByCellIndex(generatedGrid, 2).map(x => x.value)).toStrictEqual([5, 3, 6, 9, 8]);
        expect(SudokuDsl.getSubgridNeighboursByCellIndex(generatedGrid, 27).map(x => x.value)).toStrictEqual([4, 7]);
    });
});