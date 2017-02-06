// https://en.wikipedia.org/wiki/ISO_8601
// Example
//    Usage: {{ dateValue | dateToString:'[date-fns format]' }}
//    Data: 2014-01-05T18:14:18.32
//    Result: 01/05/2014

import { Pipe, PipeTransform } from '@angular/core';

import { format } from 'date-fns';

@Pipe({ name: 'dateToString' })
export class DateToStringPipe implements PipeTransform {
    // transform(value: Date, format: string): any {
    //     // return 'TODO dateToString';
    //     return moment(value).locale('nl').format(format);
    // }
    transform(value: Date | string | number, ...args: any[]): any {
        if (!value) { return ''; };
        return format(value, args[0]);
    }
}
