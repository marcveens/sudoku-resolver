import { Component, Fragment, h, State } from '@stencil/core';
import { Sudoku, StartGrid } from '../../Sudoku/Sudoku';
import { QueryString } from '../../utils/QueryString';
import { Environment } from '../../utils/Environment';
import { solveSudoku } from '../../sudoku.worker';
import { GridType } from '../../Sudoku/Grid';

// 8364 cycles
const prefilled = '0=5&1=3&4=7&9=6&12=1&13=9&14=5&19=9&20=8&25=6&27=8&31=6&35=3&36=4&39=8&41=3&44=1&45=7&49=2&53=6&55=6&60=2&61=8&66=4&67=1&68=9&71=5&76=8&79=7&80=9';
// 4 stars - 34055 cycles
// const prefilled = '0=3&6=1&7=2&9=7&10=8&11=5&16=4&23=9&31=5&36=9&39=2&44=7&45=2&49=3&50=7&52=5&53=8&55=9&58=7&60=6&63=5&66=6&68=2&73=1&80=4';
// const solved = '0=5&1=3&2=4&3=6&4=7&5=8&6=9&7=1&8=2&9=6&10=7&11=2&12=1&13=9&14=5&15=3&16=4&17=8&18=1&19=9&20=8&21=3&22=4&23=2&24=5&25=6&26=7&27=8&28=5&29=9&30=7&31=6&32=1&33=4&34=2&35=3&36=4&37=2&38=6&39=8&40=5&41=3&42=7&43=9&44=1&45=7&46=1&47=3&48=9&49=2&50=4&51=8&52=5&53=6&54=9&55=6&56=1&57=5&58=3&59=7&60=2&61=8&62=4&63=2&64=8&65=7&66=4&67=1&68=9&69=6&70=3&71=5&72=3&73=4&74=5&75=2&76=8&77=6&78=1&79=7&80=9';

@Component({
    tag: 'sudoku-grid'
})
export class SudokuGrid {
    @State() cycles: number = 0;
    @State() grid: GridType;
    @State() editMode: boolean;
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
            this.cycles = progress.cycles;
            this.grid = progress.grid;
        }).then(() => {
            console.log('finished')
        }).then(() => {
            console.log('error');
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
            </Fragment>
        );
    }
}
