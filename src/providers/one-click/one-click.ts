import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

import { AgencyModel } from '../../models/agency';
import { PlaceModel } from '../../models/place';

// OneClick Provider handles API Calls to the OneClick Core back-end.
@Injectable()
export class OneClickProvider {

  // Base OneClick URL
  // TODO: should be set dynamically based on environment
  // private oneClickUrl = 'http://localhost:3000/api/v2/';
  private oneClickUrl = 'http://occ-lynx-qa.herokuapp.com/api/v2/';

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

  // public getPlaces(places_query: String ): Promise<PlaceModel[]> {
  //
  //   return this.http
  //     .get(this.oneClickUrl + `places?name=%25${places_query}%25`)
  //     .toPromise()
  //     .then(response => response.text())
  //     // .then(r => console.log(JSON.parse(r.text()).data))
  //     .then(json => JSON.parse(json).data.places as PlaceModel[])
  //     .catch(this.handleError)
  // }

  public getPlaces(places_query: String ): Observable<PlaceModel[]> {

    return this.http.
      get(this.oneClickUrl + `places?name=%25${places_query}%25`).
      map( response => {
        return (response.json().data.places as PlaceModel[])
      })
  }

  private getAgencies(type: String): Promise<AgencyModel[]> {
    let uri: string = encodeURI(this.oneClickUrl + 'agencies?type=' + type);

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
