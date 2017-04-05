/**
 * @file Busy Config
 * @author yumao<yuzhang.lille@gmail.com>
 */

import {Subscription} from 'rxjs/Subscription';

export class InnovaBusyConfig implements IInnovaBusyConfig {
    template: string;
    delay: number;
    minDuration: number;
    backdrop: boolean;
    message: string;
    wrapperClass: string;

    constructor(config: IInnovaBusyConfig = {}) {
        this.backdrop=config.backdrop?config.backdrop:BUSY_CONFIG_DEFAULTS.backdrop;
        this.delay=config.delay?config.delay:BUSY_CONFIG_DEFAULTS.delay;
        this.message=config.message?config.message:BUSY_CONFIG_DEFAULTS.message;
        this.minDuration=config.minDuration?config.minDuration:BUSY_CONFIG_DEFAULTS.minDuration;
        this.wrapperClass=config.wrapperClass?config.wrapperClass:BUSY_CONFIG_DEFAULTS.wrapperClass;
    }
}

export interface IInnovaBusyConfig {
    delay?: number;
    minDuration?: number;
    backdrop?: boolean;
    message?: string;
    wrapperClass?: string;
    busy?: Promise<any> | Subscription | Array<Promise<any> | Subscription>
}

export const BUSY_CONFIG_DEFAULTS = {
    template: `
        <div class="innova-busy-default-wrapper">
            <div class="innova-busy-default-sign">
                <div class="innova-busy-default-spinner">
                    <div class="bar1"></div>
                    <div class="bar2"></div>
                    <div class="bar3"></div>
                    <div class="bar4"></div>
                    <div class="bar5"></div>
                    <div class="bar6"></div>
                    <div class="bar7"></div>
                    <div class="bar8"></div>
                    <div class="bar9"></div>
                    <div class="bar10"></div>
                    <div class="bar11"></div>
                    <div class="bar12"></div>
                </div>
                <div class="innova-busy-default-text">{{message}}</div>
            </div>
        </div>
    `,
    delay: 0,
    minDuration: 0,
    backdrop: true,
    message: 'Please wait...',
    wrapperClass: 'innova-busy'
};