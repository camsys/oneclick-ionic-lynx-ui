import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Transforms an integer into day of the week
 */
@Pipe({
  name: 'scheduleDay',
})
export class ScheduleDayPipe implements PipeTransform {
  
  constructor(private translate: TranslateService) { }
  
  transform(day: number): string {
    return this.translate.instant(
      "global.weekdays." + this.dayCodes[day] + "_short"
    );
  }
  
  dayCodes: string[] = [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ];
}
