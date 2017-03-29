import { Component, Input } from '@angular/core';
import { InnovaGridColumn } from './innova-grid.options';

@Component({
    selector: 'thead',
     moduleId: module.id,
    template: `
                    <tr>
                         <th *ngFor="let col of HeaderCollection" width="{{col.Width}}">{{col.Header}}</th>
                    </tr>
    `
})

export class InnovaGridHeaderComponent {
    @Input() HeaderCollection: InnovaGridColumn[];

    constructor() { }
}