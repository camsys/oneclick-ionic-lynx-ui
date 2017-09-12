import { Pipe, PipeTransform } from '@angular/core';
/*
 * Transform a number in seconds to a nice, concise time string
*/
@Pipe({name: 'prettyDistance'})
export class PrettyDistancePipe implements PipeTransform {
  transform(inputDistance: number, inputUnit: string = 'meters'): string {
    let distanceInFeet = Math.ceil(inputDistance * 3.28084);
    if (distanceInFeet <= 1000) {
      // For short distances (less than 1000 feet), return distance in feet rounded to nearest 10 feet.
      distanceInFeet = Math.round(distanceInFeet / 10) * 10;
      return distanceInFeet + ' ft';
    } else {
      // For longer distances, convert to miles and round to 1 decimal place.
      let distanceInMiles = Math.round(distanceInFeet / 5280 * 10) / 10; 
      return distanceInMiles + ' mi';
    }
  }
  
}
