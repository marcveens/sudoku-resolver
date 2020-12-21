import { Component, Fragment, h, State } from '@stencil/core';
import { Sudoku, StartGrid } from '../../Sudoku/Sudoku';
import { QueryString } from '../../utils/QueryString';
import { Environment } from '../../utils/Environment';
import { solveSudoku } from '../../sudoku.worker';
import { GridType } from '../../Sudoku/Grid';

// 51 cycles
const prefilled = '0=5&1=3&4=7&9=6&12=1&13=9&14=5&19=9&20=8&25=6&27=8&31=6&35=3&36=4&39=8&41=3&44=1&45=7&49=2&53=6&55=6&60=2&61=8&66=4&67=1&68=9&71=5&76=8&79=7&80=9';

// 4 stars - 34055 cycles
// const prefilled = '0=3&6=1&7=2&9=7&10=8&11=5&16=4&23=9&31=5&36=9&39=2&44=7&45=2&49=3&50=7&52=5&53=8&55=9&58=7&60=6&63=5&66=6&68=2&73=1&80=4';

// Sudoku designed to work against a brute force algorithm, see https://www.flickr.com/photos/npcomplete/2361922699
// const prefilled = '14=3&16=8&17=5&20=1&22=2&30=5&32=7&38=4&42=1&46=9&54=5&61=7&62=3&65=2&67=1&76=4&80=9';

@Component({
    tag: 'sudoku-grid'
})
export class SudokuGrid {
    @State() cycles: number = 0;
    @State() grid: GridType;
    @State() editMode: boolean;
    @State() error: string;
    @State() cellValues = QueryString.getParsed<StartGrid>(prefilled);

    componentWillLoad() {
        const sudoku = new Sudoku(prefilled);
        this.grid = sudoku.getGrid();
    }

    onEditModeChange() {
        this.editMode = !this.editMode;
    }

    onCellChange(cellIndex: number, value: string) {
        this.cellValues[cellIndex] = value || undefined;
        window.history.replaceState({}, '', `${window.location.pathname}?${QueryString.stringify(this.cellValues)}`);
    };

    async solveSudoku() {
        solveSudoku(this.grid, (progress) => {
        // machine.run((progress) => {
            this.cycles = progress.cycles;
            this.grid = progress.grid;
        }).catch((e) => {
            console.trace(e);
            this.error = e;
        });
    }

    render() {
        return (
            <Fragment>
                {Environment.isDevelopment && (
                    <label>
                        <input type="checkbox" onChange={() => this.onEditModeChange()} checked={this.editMode} />
                    Edit mode
                    </label>
                )}
                <br />
                <button onClick={() => this.solveSudoku()}>Solve</button>
                <br />
                <br />
                Total cycles: {this.cycles}
                <div class="sudoku-grid">
                    {this.grid.map((item, index) => (
                        <div
                            class={`sudoku-grid__cell ${item.isStaticValue ? 'sudoku-grid__cell--static' : ''}`}
                            data-cell={index}
                            data-grid={item.subgrid}
                        >
                            {this.editMode ? (
                                <input type="text" onChange={e => this.onCellChange(index, (e.currentTarget as HTMLInputElement).value)} value={item.value} />
                            ) : item.value}
                        </div>
                    ))}
                </div>
                {this.error && (
                    <div class="sudoku-grid__error">{this.error}</div>
                )}
            </Fragment>
        );
    }
}
