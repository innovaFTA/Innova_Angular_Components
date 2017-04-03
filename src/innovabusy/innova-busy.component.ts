
import {Component, Compiler, NgModule, NgModuleFactory, Injectable, DoCheck} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';

import {InnovaPromiseTrackerService} from './innova-promise-tracker.service';


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
    template: `
        <div [class]="wrapperClass" *ngIf="isActive()" @flyInOut>
            <ng-container *ngComponentOutlet="TemplateComponent; ngModuleFactory: nmf;"></ng-container>
        </div>
    `,
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
    TemplateComponent:any;
    private nmf: NgModuleFactory<any>;
    wrapperClass: string;
    template: string;
    message: string;
    private lastMessage: string;

    constructor(
        private tracker: InnovaPromiseTrackerService,
        private compiler: Compiler
    ) {}

    ngDoCheck() {
        if (this.message === this.lastMessage) {
            return;
        }
        this.lastMessage = this.message;
        this.createDynamicTemplate();
    }

    createDynamicTemplate() {
        const {template, message} = this;

        @Component({template})
        class TemplateComponent {
            message: string = message;
        }

        @NgModule({
            declarations: [TemplateComponent],
            entryComponents: [TemplateComponent]
        })
        class TemplateModule {}

        this.TemplateComponent = TemplateComponent;
        this.nmf = this.compiler.compileModuleSync(TemplateModule);
    }

    isActive() {
        return this.tracker.isActive();
    }
}