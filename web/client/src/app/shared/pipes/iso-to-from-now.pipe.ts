import { Pipe, PipeTransform } from '@angular/core';

import { distanceInWordsToNow } from 'date-fns';

@Pipe({ name: 'isoToFromNow' })
export class IsoToFromNowPipe implements PipeTransform {
  // transform(value: string, args: string[]): any {
  //   // return 'TODO isoToFromNow';
  //   // TODO setting locale does not work somehow
  //   let result = moment(value).locale('nl').fromNow();
  //   // console.log('value', value, 'result', result);
  //   return result;
  // }
  transform(value: Date | string | number, ...args: any[]): any {
    if (!value) { return ''; };
    let locale = require('date-fns/locale/nl');
    return `${distanceInWordsToNow(value, { locale: locale })} geleden`;
  }
}
