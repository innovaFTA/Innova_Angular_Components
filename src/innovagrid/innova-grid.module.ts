import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InnovaGridComponent } from './innova-grid.component';
import { InnovaGridHeaderComponent } from './innova-grid-header.component';
import { InnovaGridPagingComponent } from './innova-grid-paging.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        InnovaGridComponent,
        InnovaGridHeaderComponent,
        InnovaGridPagingComponent
    ],
    exports: [InnovaGridComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class InnovaGridModule {

}