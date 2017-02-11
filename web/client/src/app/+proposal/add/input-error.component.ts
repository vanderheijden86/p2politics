import { Component, Input, Host } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';

const ERROR_MESSAGES = {
    'required': 'Dit veld is verplicht'
};

@Component({
    selector: 'input-error',
    template: `<div *ngIf="(control.dirty || form.submitted) && control.errors && control.errors[error]" class="text-danger">{{errorMessages[error]}}</div>`
})
export class InputErrorComponent {
    @Input() control: AbstractControl;
    @Input() error: string;

    errorMessages = ERROR_MESSAGES;

    constructor(@Host() private form: FormGroupDirective) { }
}
