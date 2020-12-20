import { Component, h } from '@stencil/core';

@Component({
    tag: 'app-root'
})
export class AppRoot {
    render() {
        return (
            <div>
                <header>
                    <h1>Stencil App Starter</h1>
                </header>

                <main>
                    <sudoku-grid />
                </main>
            </div>
        );
    }
}