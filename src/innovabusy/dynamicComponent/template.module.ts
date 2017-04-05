import { NgModule } from "@angular/core";
import { TemplateComponent } from "./template.component";
import { CommonModule } from "@angular/common";


@NgModule({
    imports: [CommonModule],
    declarations: [
        TemplateComponent
    ],
    entryComponents: [
        TemplateComponent
    ]
})

export class TemplateModule {

}