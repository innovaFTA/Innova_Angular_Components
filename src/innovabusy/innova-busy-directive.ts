import {
    Directive,
    Component,
    Input,
    DoCheck,
    ViewContainerRef,
    ComponentFactoryResolver,
    ComponentRef,
    Injector
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { equals } from './util';
import { InnovaPromiseTrackerService } from './innova-promise-tracker.service';
import { InnovaBusyService } from './innova-busy.service';
import { IInnovaBusyConfig } from './innova-busy-config';
import { InnovaBusyComponent } from './innova-busy.component';
import { InnovaBusyBackdropComponent } from './innova-busy-backdrop.component';

/**
 * ### Syntax
 *
 * - `<div [ngBusy]="busy">...</div>`
 * - `<div [ngBusy]="[busyA, busyB, busyC]">...</div>`
 * - `<div [ngBusy]="{busy: busy, message: 'Loading...', backdrop: false, delay: 200, minDuration: 600}">...</div>`
 */
@Directive({
    selector: '[innovaBusy]',
    providers: [InnovaPromiseTrackerService]
})
export class InnovaBusyDirective implements DoCheck {
    @Input('innovaBusy') options: any;
    private optionsRecord: any;
    private optionsNorm: IInnovaBusyConfig;
    template: string;
    backdrop: boolean;
    private busyRef: ComponentRef<InnovaBusyComponent>;
    private backdropRef: ComponentRef<InnovaBusyBackdropComponent>;

    constructor(
        private service: InnovaBusyService,
        private tracker: InnovaPromiseTrackerService,
        private cfResolver: ComponentFactoryResolver,
        private vcRef: ViewContainerRef,
        private injector: Injector
    ) {
    }

    private normalizeOptions(options: any) {
        if (!options) {
            options = { busy: null };
        }
        else if (Array.isArray(options)
            || options instanceof Promise
            || options instanceof Subscription
        ) {
            options = { busy: options };
        }
        options = Object.assign({}, this.service.config, options);
        if (!Array.isArray(options.busy)) {
            options.busy = [options.busy];
        }

        return options;
    }

    private dectectOptionsChange() {
        if (equals(this.optionsNorm, this.optionsRecord)) {
            return false;
        }
        this.optionsRecord = this.optionsNorm;
        return true;
    }

    // As ngOnChanges does not work on Object detection, ngDoCheck is using
    ngDoCheck() {
        const options = this.optionsNorm = this.normalizeOptions(this.options);

        if (!this.dectectOptionsChange()) {
            return;
        }

        if (this.busyRef) {
            this.busyRef.instance.message = options.message;
        }

        !equals(options.busy, this.tracker.promiseList)
            && this.tracker.reset({
                promiseList: options.busy,
                delay: options.delay,
                minDuration: options.minDuration
            });

        if (!this.busyRef
            || this.template !== options.template
            || this.backdrop !== options.backdrop
        ) {
            this.destroyComponents();

            this.template = options.template;
            this.backdrop = options.backdrop;

            options.backdrop && this.createBackdrop();

            this.createBusy();
        }
    }

    ngOnDestroy() {
        this.destroyComponents();
    }

    private destroyComponents() {
        this.busyRef && this.busyRef.destroy();
        this.backdropRef && this.backdropRef.destroy();
    }

    private createBackdrop() {
        const backdropFactory = this.cfResolver.resolveComponentFactory(InnovaBusyBackdropComponent);
        this.backdropRef = this.vcRef.createComponent(backdropFactory, null, this.injector);
    }

    private createBusy() {
        const busyFactory = this.cfResolver.resolveComponentFactory(InnovaBusyComponent);
        this.busyRef = this.vcRef.createComponent(busyFactory, null, this.injector);

        const { message, wrapperClass, template } = this.optionsNorm;
        const instance = this.busyRef.instance;
        instance.message = message;
        instance.wrapperClass = wrapperClass;
        instance.template = template;
    }
}