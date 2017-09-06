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

}
