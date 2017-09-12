import { Pipe, PipeTransform } from '@angular/core';
/*
 * Convert a number into a string
*/
@Pipe({name: 'toString'})
export class ToStringPipe implements PipeTransform {
  transform(input: number): string {
    return input.toString();
  }
  
}
