import { Component, Input, Output , EventEmitter} from '@angular/core';
import { InnovaGridColumn } from './innova-grid.options';

@Component({
    selector: 'thead',
    template: `
    <tr>
    <th *ngIf="AllowCheckBoxHeader">
    <input type="checkbox" [checked]="false" (click)="allhandleChange($event)" value="1" 
    >
    </th>
    <th *ngFor="let col of HeaderCollection" width="{{col.Width}}">{{col.Header}}</th>
</tr>
    `
})

export class InnovaGridHeaderComponent {
    @Input() HeaderCollection: InnovaGridColumn[];
    @Input() AllowCheckBoxHeader: boolean;
    @Output() OnAllCheckBoxChanged = new EventEmitter();
    constructor() { }
    public allhandleChange(args) {
        this.OnAllCheckBoxChanged.emit({ isDataChecked:args.target.checked});
    }
}