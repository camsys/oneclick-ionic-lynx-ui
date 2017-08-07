import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AgencyModel } from '../../models/agency';
import { Global } from '../../app/global';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';

// OneClick Provider handles API Calls to the OneClick Core back-end.
@Injectable()
export class OneClickProvider {
  
  public oneClickUrl = Global.BASE_ONECLICK_URL;

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

  // Gets a User from 1-Click
  getProfile(): Promise<User>{

     //Review: Should we be creating a new AuthProvider every time?
     let auth = new AuthProvider(this.http);
     let headers = auth.authHeaders();
     let options = new RequestOptions({ headers: headers });

     var uri: string = encodeURI(this.oneClickUrl + 'users');
     return this.http.get(uri, options)
      .toPromise()
      .then(response => response.text())
      .then(json => JSON.parse(json).data.user as User)
      .catch(this.handleError);
  }

  // Updates a User in 1-Click
  updateProfile(user: User): Promise<User>{
     let auth = new AuthProvider(this.http);
     let headers = auth.authHeaders();
     let body = {
  "attributes": {
    "first_name": user.first_name, 
    "last_name": user.last_name,
    "email": user.email,
    "password": user.password,
    "preferred_locale": user.preferred_locale
  }};
     let options = new RequestOptions({ headers: headers });

     var uri: string = encodeURI(this.oneClickUrl + 'users');
     return this.http.put(uri, body, options)
      .toPromise()
      .then(response => response.text())
      .then(json => JSON.parse(json).data.user as User)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    console.error('An error occurred', error.text()); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
