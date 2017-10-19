import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms an integer into day of the week
 */
@Pipe({
  name: 'scheduleDay',
})
export class ScheduleDayPipe implements PipeTransform {
  transform(day: number): string {
    return this.shortDays[day];
  }
  
  shortDays: string[] = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
}
