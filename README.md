# Sudoku resolver

A fun little hobby project involving some creative problem solving and an interesting algorithm. 

The puzzle is solved using a recursive function in combination with a backtracking algorithm. For every empty cell a list of possible valid values is created. The first value is placed and the program moves on to the next empty field. When the program encounters a field with no possible valid values, the backtracking algorithm makes sure the previous cell is checked to see if another value is possible to fill in. If that's the case, the other value is used and the program continues. If it's not the case, it goes back another cell and tries everything again.

## Statistics
- Used grid:
`0=5&1=3&4=7&9=6&12=1&13=9&14=5&19=9&20=8&25=6&27=8&31=6&35=3&36=4&39=8&41=3&44=1&45=7&49=2&53=6&55=6&60=2&61=8&66=4&67=1&68=9&71=5&76=8&79=7&80=9`
--- 
### Version 1.0
- Cycles: 8364
- Duration: 44.1s
- Memory footprint: 1,027,704K
### Version 1.1
Now includes Web Worker
- Cycles: 8364
- Duration: 44.1s
- Memory footprint: 161,084K

## Ideas
- ~~Bruteforce with backtracking~~
- ~~Use Web Workers~~
- First fill in inevitable values

## Used techniques
- [StencilJS](https://www.npmjs.com/package/@stencil/core) (Web components)
- [qs](https://www.npmjs.com/package/qs)
- [lodash](https://www.npmjs.com/package/lodash)
- [jest](https://www.npmjs.com/package/jest)