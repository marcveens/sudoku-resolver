import { GridCreator } from '../Grid';
import generatedGrid from './data/generatedGrid.json';

describe('Grid', () => {
    const grid = new GridCreator();

    it('should create a grid', () => {
        // arrange 
        const startGrid = '0=5&1=3&4=7&9=6&12=1&13=9&14=5&19=9&20=8&25=6&27=8&31=6&35=3&36=4&39=8&41=3&44=1&45=7&49=2&53=6&55=6&60=2&61=8&66=4&67=1&68=9&71=5&76=8&79=7&80=9';
        
        // act + assert
        expect(JSON.stringify(grid.create(startGrid))).toEqual(JSON.stringify(generatedGrid));
    });
});