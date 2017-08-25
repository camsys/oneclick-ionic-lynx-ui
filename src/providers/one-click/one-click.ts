import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

import { AgencyModel } from '../../models/agency';
import { PlaceModel } from '../../models/place';
import { CategoryFor211Model } from '../../models/category-for-211'
import { SubcategoryFor211Model } from '../../models/subcategory-for-211'
import { SubcategoryLinkFor211Model } from '../../models/subcategory-link-for-211'
import { MatchListFor211Model } from '../../models/match-list-for-211'


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
    let formatted_accs = {};
    let formatted_eligs = {};

    for (let acc of user.accommodations) {
      formatted_accs[acc.code] = acc.value;
    }

    for (let elig of user.eligibilities) {
      formatted_eligs[elig.code] = elig.value;
    }

    let body = {
      "attributes": {
      "first_name": user.first_name,
      "last_name": user.last_name,
      "email": user.email,
      "password": user.password,
      "preferred_locale": user.preferred_locale
      },
      "accommodations": formatted_accs,
      "eligibilities": formatted_eligs,
      };

     let options = new RequestOptions({ headers: headers });

     var uri: string = encodeURI(this.oneClickUrl + 'users');
     return this.http.put(uri, body, options)
      .toPromise()
      .then(response => response.text())
      .then(json => JSON.parse(json).data.user as User)
      .catch(this.handleError);
  }

  getCategoriesFor211Services(): Promise<CategoryFor211Model[]> {
    var uri: string = encodeURI(this.oneClickUrl+'oneclick_refernet/categories');

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(jsonable => JSON.parse(jsonable) as CategoryFor211Model)
      .catch(this.handleError);
  }

  getSubcategoryForCategoryName(categoryName: string): Promise<SubcategoryFor211Model[]> {
    var uri: string = encodeURI(this.oneClickUrl+'oneclick_refernet/sub_categories?category='+categoryName);

    console.log(uri);

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(jsonable => JSON.parse(jsonable) as SubcategoryFor211Model)
      .catch(this.handleError);
  }

  getSubSubcategoryForSubcategoryName(subcategoryName: string): Promise<SubcategoryLinkFor211Model[]>{

    var uri: string = encodeURI(this.oneClickUrl+'oneclick_refernet/sub_sub_categories?sub_category='+subcategoryName);

    // console.log(uri);

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(jsonable => JSON.parse(jsonable) as SubcategoryLinkFor211Model)
      .catch(this.handleError);
  }

  getMatchListForSubcategoryLinkNameAndCountyCode(subcategroyLinkName: string): Promise<MatchListFor211Model[]>{
    var uri: string = encodeURI(this.oneClickUrl+'oneclick_refernet/services?sub_sub_category='+subcategroyLinkName);

    // console.log(uri);

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(jsonable => JSON.parse(jsonable) as MatchListFor211Model)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    console.error('An error occurred', error.text()); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
