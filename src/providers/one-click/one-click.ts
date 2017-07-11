import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { TransportationProviderModel } from '../../models/transportation-provider';

// OneClick Provider handles API Calls to the OneClick Core back-end.
@Injectable()
export class OneClickProvider {
  
  private oneClickUrl = 'http://localhost:3000/api/v2/';

  constructor(public http: Http) {}
  
  getTransportationProviders(): Promise<TransportationProviderModel[]> {    
    var uri: string = encodeURI(this.oneClickUrl+'agencies?type=transportation');
    
    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(json => JSON.parse(json).data.agencies as TransportationProviderModel[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    console.error('An error occurred', error.text()); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
