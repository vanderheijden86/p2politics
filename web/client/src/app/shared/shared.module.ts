import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EnumPipe } from './pipes/enum.pipe';
import { DateToStringPipe } from './pipes/date-to-string.pipe';
import { IsoToFromNowPipe } from './pipes/iso-to-from-now.pipe';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        // pipes
        EnumPipe,
        DateToStringPipe,
        IsoToFromNowPipe,
        // widgets
    ],
    declarations: [
        // pipes
        EnumPipe,
        DateToStringPipe,
        IsoToFromNowPipe,
        // widgets
    ],
    providers: [
    ],
    schemas: [
        NO_ERRORS_SCHEMA, // for ng-content select='tag'
    ],
})
export class SharedModule {
}
