import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AgencyModel } from '../../models/agency';

// OneClick Provider handles API Calls to the OneClick Core back-end.
@Injectable()
export class OneClickProvider {
  
  // Base OneClick URL
  // TODO: should be set dynamically based on environment
  private oneClickUrl = 'http://localhost:3000/api/v2/';

  constructor(public http: Http) {}
  
  // Gets a list of all Transportation Agencies
  getTransportationAgencies(): Promise<AgencyModel[]> {
    return this.getAgencies("transportation");
  }
  
  // Gets a list of all Partner Agencies
  getPartnerAgencies(): Promise<AgencyModel[]> {
    return this.getAgencies("partner");
  }
  
  // Gets a list of ALL agencies, regardless of type
  getAllAgencies(): Promise<AgencyModel[]> {
    return this.getAgencies("");
  }
  
  private getAgencies(type: String): Promise<AgencyModel[]> {
    var uri: string = encodeURI(this.oneClickUrl + 'agencies?type=' + type);
    
    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(json => JSON.parse(json).data.agencies as AgencyModel[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    console.error('An error occurred', error.text()); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
