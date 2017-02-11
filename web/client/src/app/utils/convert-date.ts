import { getTime } from 'date-fns';

export class ConvertDate {
    static toUnix(date: Date): number {
        if (!date) { return undefined; }
        return getTime(date) / 1000;
    };

    static fromUnix(number: number): Date {
        if (!number) { return undefined; }
        return new Date(number * 1000);
    };
}
