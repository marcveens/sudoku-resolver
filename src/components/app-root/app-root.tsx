import { Component, h } from '@stencil/core';

@Component({
    tag: 'app-root'
})
export class AppRoot {
    render() {
        return (
            <div>
                <main>
                    <sudoku-grid />
                </main>
            </div>
        );
    }
}