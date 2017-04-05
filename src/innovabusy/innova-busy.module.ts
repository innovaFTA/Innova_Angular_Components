import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModuleWithProviders } from "@angular/core";

import { InnovaBusyDirective } from "./innova-busy-directive";
import { InnovaBusyService } from "./innova-busy.service";
import { InnovaBusyBackdropComponent } from "./innova-busy-backdrop.component";
import { InnovaBusyComponent } from "./innova-busy.component";
import { InnovaBusyConfig } from "./innova-busy-config";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        InnovaBusyDirective,
        InnovaBusyComponent,
        InnovaBusyBackdropComponent
    ],
    providers: [InnovaBusyService],
    exports: [
        InnovaBusyDirective
    ],
    entryComponents: [
        InnovaBusyComponent,
        InnovaBusyBackdropComponent
    ]
})
export class InnovaBusyModule {
    static forRoot(config: InnovaBusyConfig): ModuleWithProviders {
        return {
            ngModule: InnovaBusyModule,
            providers: [
                { provide: InnovaBusyConfig, useValue: config }
            ]
        };
    }
}