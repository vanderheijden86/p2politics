export class ConvertDecimal {
  static toDecimal(number): number {
    if (!number) { return undefined; }
    return number[0].numerator + number[1].numerator / (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);
  };
}
