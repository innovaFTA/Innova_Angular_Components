import {Injectable, Optional} from '@angular/core';

import {InnovaBusyConfig} from './innova-busy-config';

@Injectable()
export class InnovaBusyService {
    config: InnovaBusyConfig;

    constructor(@Optional() config: InnovaBusyConfig) {
        this.config = config || new InnovaBusyConfig();
    }
}