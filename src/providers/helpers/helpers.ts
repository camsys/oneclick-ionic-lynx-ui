import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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
  
}
