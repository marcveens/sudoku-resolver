import { Validator } from '../Validator';
import solvedSudoku from './data/solvedSudoku.json';
import invalidSolvedSudoku1 from './data/invalidSolvedSudoku1.json';
import invalidSolvedSudoku2 from './data/invalidSolvedSudoku2.json';
import invalidSolvedSudoku3 from './data/invalidSolvedSudoku3.json';

describe('Validator', () => {
    const validator = new Validator();

    describe('validateStartGrid', () => {
        it('should validate valid startGrid string', () => {
            // arrange
            const startGrid = '0=1&1=9&80=3';

            // act + assert
            expect(() => validator.validateStartGrid(startGrid)).not.toThrow();
        });

        it('should throw when more than 81 cells', () => {
            // arrange
            const startGrid = '0=1&1=1&2=1&3=1&4=1&5=1&6=1&7=1&8=1&9=1&10=1&11=1&12=1&13=1&14=1&15=1&16=1&17=1&18=1&19=1&20=1&21=1&22=1&23=1&24=1&25=1&26=1&27=1&28=1&29=1&30=1&31=1&32=1&33=1&34=1&35=1&36=1&37=1&38=1&39=1&40=1&41=1&42=1&43=1&44=1&45=1&46=1&47=1&48=1&49=1&50=1&51=1&52=1&53=1&54=1&55=1&56=1&57=1&58=1&59=1&60=1&61=1&62=1&63=1&64=1&65=1&66=1&67=1&68=1&69=1&70=1&71=1&72=1&73=1&74=1&75=1&76=1&77=1&78=1&79=1&80=1&81=1';

            // act + assert
            expect(() => validator.validateStartGrid(startGrid)).toThrow();
        });

        it('should throw when key is higher than 80', () => {
            // arrange
            const startGrid = '0=1&1=1&81=1';

            // act + assert
            expect(() => validator.validateStartGrid(startGrid)).toThrow();
        });

        it('should throw when any key is not a number', () => {
            // arrange
            const startGrid = '0=1&1=1&a=1';

            // act + assert
            expect(() => validator.validateStartGrid(startGrid)).toThrow();
        });

        it('should throw when any value is not a number', () => {
            // arrange
            const startGrid = '0=1&1=1&60=a';

            // act + assert
            expect(() => validator.validateStartGrid(startGrid)).toThrow();
        });

        it('should throw when any value is higher than 9', () => {
            // arrange
            const startGrid = '0=1&1=1&60=10';

            // act + assert
            expect(() => validator.validateStartGrid(startGrid)).toThrow();
        });

        it('should throw when any value is lower than 1', () => {
            // arrange
            const startGrid = '0=1&1=1&60=0';

            // act + assert
            expect(() => validator.validateStartGrid(startGrid)).toThrow();
        });
    });

    describe('validateGrid', () => {
        it('should validate valid complete grid', () => {
            // act + assert
            expect(() => validator.validateGrid(solvedSudoku)).not.toThrow();
        });

        it('should invalidate grid with invalid vertical lines', () => {
            // act + assert
            expect(() => validator.validateVerticalRows(invalidSolvedSudoku1)).toThrow();
        });

        it('should invalidate grid with invalid horizontal lines', () => {
            // act + assert
            expect(() => validator.validateHorizontalRows(invalidSolvedSudoku2)).toThrow();
        });

        // it('should invalidate grid with invalid subgrid', () => {
        //     // act + assert
        //     expect(() => validator.validateSubgrids(invalidSolvedSudoku3)).toThrow();
        // });
    });
});