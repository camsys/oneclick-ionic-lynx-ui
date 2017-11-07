import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
/*
 * Transform a number in seconds to a nice, concise time string
*/
@Pipe({name: 'prettyTime'})
export class PrettyTimePipe implements PipeTransform {
  
  constructor(private translate: TranslateService) { }
  
  transform(seconds: number | null | undefined): string {
    if(!seconds) { return this.translate.instant("lynx.global.time.unknown"); } // Return string "unknown" if value is null
    let timeString = "";
    
    // populate hours
    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;    
    if(hours > 0) {
      timeString += (hours + " " + this.translate.instant("lynx.global.time.hour_short") + " ");
    }
    
    // populate minutes
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;    
    if(minutes > 0) {
      timeString += (minutes + " " + this.translate.instant("lynx.global.time.minute_short"));
    }
    
    return timeString;
  }
}
