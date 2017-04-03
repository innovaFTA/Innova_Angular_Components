import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { InnovaPromiseTrackerService } from './innova-promise-tracker.service';

const inactiveStyle = style({
    opacity: 0,
});
const timing = '.3s ease';

@Component({
    selector: 'innova-busy-backdrop',
    template: `
        <div class="innova-busy-backdrop"
             @fadeInOut
             *ngIf="isActive()">
        </div>
    `,
    animations: [
        trigger('fadeInOut', [
            transition('void => *', [
                inactiveStyle,
                animate(timing)
            ]),
            transition('* => void', [
                animate(timing, inactiveStyle)
            ])
        ])
    ]
})

export class InnovaBusyBackdropComponent {

    constructor(private tracker: InnovaPromiseTrackerService) {
    }

    isActive() {
        return this.tracker.isActive();
    }
}