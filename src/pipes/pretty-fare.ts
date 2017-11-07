import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { I18nProvider } from '../providers/i18n/i18n';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generates a nicely formatted string based on an array of fares. May return
 * a single fare (e.g. $5), a range (e.g. $6-$13), or a fare-unknown message. 
 */
@Pipe({
  name: 'prettyFare',
})
export class PrettyFarePipe implements PipeTransform {
  
  constructor(private translate: TranslateService,
              private i18n: I18nProvider) { }
  
  transform(fares: number[]): string {
    
    // If the fares array is empty, return a fare-unknown message.
    if(fares.length <= 0) {
      return this.translate.instant("lynx.global.fare.no_fare");
    }
    
    // Pull out the min and max fares
    let minFare = fares.reduce((f1,f2) => Math.min(f1,f2));
    let maxFare = fares.reduce((f1,f2) => Math.max(f1,f2));
    
    // If the min and max are the same, return a single fare value.
    if (minFare === maxFare) {
      return this.formatFare(minFare);
    } else {
      // Otherwise, return a range
      return this.formatFare(minFare) + " - " + this.formatFare(maxFare);
    }
    
  }
  
  // Formats a number as USD, with no cents.
  formatFare(fare: number): string {
    return new CurrencyPipe(this.i18n.currentLocale())
               .transform(fare, 'USD', true, '1.0-0');
  }
  
  
}
