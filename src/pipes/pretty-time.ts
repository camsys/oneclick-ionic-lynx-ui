import { Pipe, PipeTransform } from '@angular/core';
/*
 * Transform a number in seconds to a nice, concise time string
*/
@Pipe({name: 'prettyTime'})
export class PrettyTimePipe implements PipeTransform {
  transform(seconds: number | null | undefined): string {
    if(!seconds) { return "unknown"; } // Return string "unknown" if value is null
    let timeString = "";
    
    // populate hours
    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;    
    if(hours > 0) {
      timeString += (hours + " hr ");
    }
    
    // populate minutes
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;    
    if(minutes > 0) {
      timeString += (minutes + " min");
    }
    
    return timeString;
  }
}
