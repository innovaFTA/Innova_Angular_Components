
import {
    Component,
    DoCheck,
    ViewChild,
    ElementRef,
    Renderer
} from "@angular/core";
import { trigger, style, transition, animate } from "@angular/animations";

import { InnovaPromiseTrackerService } from "./innova-promise-tracker.service";


const inactiveStyle = style({
    opacity: 0,
    transform: 'translateY(-40px)'
});
const timing = '.3s ease';

export interface IBusyContext {
    message: string;
};

@Component({
    selector: 'innova-busy',
    exportAs: 'innova-busy',
    templateUrl: './innova-busy.template.html',
    animations: [
        trigger('flyInOut', [
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
export class InnovaBusyComponent implements DoCheck {
    @ViewChild('vcContainer') vcContainer: ElementRef;
    wrapperClass: string;
    template: string;
    message: string;
    private lastMessage: string;
    constructor(
        private tracker: InnovaPromiseTrackerService,
        private renderer: Renderer
    ) { }

    ngDoCheck() {
        if (!this.isActive()) {
            this.renderer.setElementStyle(this.vcContainer.nativeElement, "display", "none");
        }
        else {
            this.renderer.setElementStyle(this.vcContainer.nativeElement, "display", "block");
        }
    }


    isActive(): boolean {
        return this.tracker.isActive();
    }
}