export class ConvertString {
  static asciiToString(value: string): string {
    return value.replace(/[^\x20-\x7E]+/g, '');
  };
}
