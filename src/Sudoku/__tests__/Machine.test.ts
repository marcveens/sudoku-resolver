import { GridItem } from '../Grid';
import { Machine } from '../Machine';
import generatedGrid from './data/generatedGrid.json';

describe('Machine', () => {
    const machine = new Machine(generatedGrid);

    it('should populate meta data by index', () => {
        // arrange + act 
        const populatedCell = machine.populateMetaDataByIndex(2);
        const expectedOutcome = new GridItem({
            subgrid: 0,
            invalidValues: [5, 3, 7, 8, 6, 9],
            possibleValidValues: [1, 2, 4],
            isStaticValue: false,
            value: 1
        });

        // assert
        expect(JSON.stringify(populatedCell)).toStrictEqual(JSON.stringify(expectedOutcome));
    });
});