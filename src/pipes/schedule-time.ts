import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms seconds since midnight to a pretty time string
 */
@Pipe({
  name: 'scheduleTime',
})
export class ScheduleTimePipe implements PipeTransform {
  transform(secs: number): string {
    let hrs = Math.floor(secs / 3600);
    let mins = Math.floor((secs - (hrs * 3600)) / 60);
    let ampm = "PM";
    
    // Set AM/PM
    if(hrs <= 12 || hrs >= 24) {
      ampm = "AM"
    }
    
    // Convert hour from 24-hour to 12-hour time
    if(hrs === 0 || hrs === 24) {
      hrs = 12;
    } else if(hrs > 12) {
      hrs = hrs - 12;
    }
    
    return hrs + ":" + ("00" + mins).slice(-2) + " " + ampm;
  }
}
