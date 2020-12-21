import { Component, Event, EventEmitter, Fragment, h, Listen, State } from '@stencil/core';
import { GridType } from '../../Sudoku/Grid';
import { Sudoku, StartGrid } from '../../Sudoku/Sudoku';
import { QueryString } from '../../utils/QueryString';

const prefilled = '0=5&1=3&4=7&9=6&12=1&13=9&14=5&19=9&20=8&25=6&27=8&31=6&35=3&36=4&39=8&41=3&44=1&45=7&49=2&53=6&55=6&60=2&61=8&66=4&67=1&68=9&71=5&76=8&79=7&80=9';
// const solved = '0=5&1=3&2=4&3=6&4=7&5=8&6=9&7=1&8=2&9=6&10=7&11=2&12=1&13=9&14=5&15=3&16=4&17=8&18=1&19=9&20=8&21=3&22=4&23=2&24=5&25=6&26=7&27=8&28=5&29=9&30=7&31=6&32=1&33=4&34=2&35=3&36=4&37=2&38=6&39=8&40=5&41=3&42=7&43=9&44=1&45=7&46=1&47=3&48=9&49=2&50=4&51=8&52=5&53=6&54=9&55=6&56=1&57=5&58=3&59=7&60=2&61=8&62=4&63=2&64=8&65=7&66=4&67=1&68=9&69=6&70=3&71=5&72=3&73=4&74=5&75=2&76=8&77=6&78=1&79=7&80=9';

@Component({
    tag: 'sudoku-grid'
})
export class SudokuGrid {
    @State() grid: GridType = [];
    @State() grid2: number = 1;
    @State() editMode: boolean = false;
    @State() cellValues = QueryString.getParsed<StartGrid>(prefilled);
    @Event() gridUpdated: EventEmitter<GridType>;

    componentWillLoad() {
        new Sudoku(prefilled, this.gridUpdated);
    }

    componentShouldUpdate() {
        console.log(arguments);
    }

    onEditModeChange(event: Event) {
        const elem = event.currentTarget as HTMLInputElement;
        this.editMode = elem.checked;
    }

    onCellChange(cellIndex: number, value: string) {
        this.cellValues[cellIndex] = value;
        window.history.replaceState({}, '', `${window.location.pathname}?${QueryString.stringify(this.cellValues)}`);
    };

    @Listen('gridUpdated')
    onGridUpdate(event: CustomEvent<GridType>) {
        console.log('update');
        this.grid = [...event.detail];
    }

    render() {
        return (
            <Fragment>
                <label>
                    <input type="checkbox" onChange={this.onEditModeChange} checked={this.editMode} />
                    Edit mode
                    {this.grid2}
                </label>
                <br />
                <br />
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
                            {JSON.stringify(item.possibleValidValues)}
                        </div>
                    ))}
                </div>
            </Fragment>
        );
    }
}
