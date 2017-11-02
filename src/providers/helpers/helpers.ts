import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  This Provider is intended as a catch-all for miscellaneous reusable bits of code.
*/
@Injectable()
export class HelpersProvider {

  // Returns boolean for whether url is present and more than just an empty "http://"
  urlPresent(url: String): Boolean {
    return !!(url && url.match(/^https?:\/\/.+$/));
  }

  // Returns 1, 0, -1 based on times passed (in seconds). Sorts smaller numbers
  // first, but null/falsey values last
  compareTimes( a: number | null | undefined,
                b: number | null | undefined) {
    if(!a && !b)  {
      return 0;   // a == b if both falsey
    } else if(!a && b) {
      return 1;   // a > b if a is falsey but b is not
    } else if(a && !b) {
      return -1;  // a < b if b is falsey but a is not
    } else {
      return Math.sign(a - b); // simple comparison of a and b if both are numbers
    }
  }

  // Give it a number to round and a break point to round to, and it will round
  // up to the nearest integer multiple of the break point
  roundUpToNearest(numberToRound:number, breakPoint:number):number {
    return Math.ceil(numberToRound / breakPoint) * breakPoint;
  }

  // Give it a number to round and a break point to round to, and it will round
  // down to the nearest integer multiple of the break point
  roundDownToNearest(numberToRound:number, breakPoint:number):number {
    return Math.floor(numberToRound / breakPoint) * breakPoint;
  }

  // Given a date object, returns an ISO string with time zone offset
  dateISOStringWithTimeZoneOffset(d: Date) {
    let tzo = -d.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return d.getFullYear() +
        '-' + pad(d.getMonth() + 1) +
        '-' + pad(d.getDate()) +
        'T' + pad(d.getHours()) +
        ':' + pad(d.getMinutes()) +
        ':' + pad(d.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
  }

  // Get an array of the next n years, including the current year
  getYearsArray(n: number) {
    let currentYear = (new Date()).getFullYear();
    let years = [];
    for(let i=0; i < n; i++) {
      years.push(currentYear + i);
    }
    return years;
  }

  // Gets an array of times through a 24-hour period
  // All times will be returned as Date objects with the same date as the passed base param
  // Times will be counted up in minutes based on the passed interval param
  getTimesArray(base: Date=new Date(), interval: number=60): Date[] {
    let time = new Date(base);
    time.setHours(0,0,0,0);
    let date = time.getDate();
    let times = [time];
    while(date === time.getDate()) {
      time = new Date(time);
      time.setMinutes(time.getMinutes() + interval);
      times.push(time);
    }
    return times;
  }

}
