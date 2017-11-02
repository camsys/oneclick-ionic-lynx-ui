import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { RequestOptions } from '@angular/http';


import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

import { AgencyModel } from '../../models/agency';
import { GooglePlaceModel } from '../../models/google-place';
import { Alert } from '../../models/alert';
import { CategoryFor211Model } from '../../models/category-for-211';
import { SubcategoryFor211Model } from '../../models/subcategory-for-211';
import { SubSubcategoryFor211Model } from '../../models/sub-subcategory-for-211';
import { ServiceModel } from '../../models/service';
import { OneClickServiceModel } from '../../models/one-click-service';
import { TripRequestModel } from '../../models/trip-request';
import { TripResponseModel } from '../../models/trip-response';
import { FeedbackModel } from '../../models/feedback';
import { SearchResultModel } from '../../models/search-result';

import { environment } from '../../app/environment'
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';

// OneClick Provider handles API Calls to the OneClick Core back-end.
@Injectable()
export class OneClickProvider {

  public oneClickUrl = environment.BASE_ONECLICK_URL;

  constructor(public http: Http,
              private auth: AuthProvider) {}

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

  public getPlaces(places_query: String ): Observable<GooglePlaceModel[]> {
    return this.http.
      get(this.oneClickUrl + `places?name=%25${places_query}%25`).
      map( response => {
        return (response.json().data.places as GooglePlaceModel[])
      })
  }

  public getAgencies(type: String): Promise<AgencyModel[]> {
    let uri: string = encodeURI(this.oneClickUrl + 'agencies?type=' + type);

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(json => JSON.parse(json).data.agencies as AgencyModel[])
      .catch(this.handleError);
  }

  // Gets all paratransit services from OneClick
  public getParatransitServices(): Promise<OneClickServiceModel[]> {
    let uri: string = encodeURI(this.oneClickUrl + 'services?type=paratransit');

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(json => JSON.parse(json).data.services as OneClickServiceModel[])
      .catch(this.handleError);
  }

  // Gets a User from 1-Click
  getProfile(): Promise<User>{

     let headers = this.auth.authHeaders();
     let options = new RequestOptions({ headers: headers });

     var uri: string = encodeURI(this.oneClickUrl + 'users');
     return this.http.get(uri, options)
      .toPromise()
      .then(response => response.text())
      .then(json => JSON.parse(json).data.user as User)
      .then((user) => {
        // Store the profile in the session's user attribute
        let session = this.auth.session();
        session.user = user;
        this.auth.setSession(session);
        return user;
      })
      .catch(this.handleError);
  }

  // Updates a User in 1-Click
  updateProfile(user: User): Promise<User>{

    let headers = this.auth.authHeaders();
    let formatted_accs = {};
    let formatted_eligs = {};
    let formatted_trip_types = {};

    for (let acc of user.accommodations) {
      formatted_accs[acc.code] = acc.value;
    }

    for (let elig of user.eligibilities) {
      formatted_eligs[elig.code] = elig.value;
    }

    for (let trip_type of user.trip_types){
      formatted_trip_types[trip_type.code] = trip_type.value;
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
      "trip_types": formatted_trip_types
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
      .then(jsonable => JSON.parse(jsonable) as CategoryFor211Model[])
      .catch(this.handleError);
  }

  getSubcategoryForCategoryName(categoryName: string): Promise<SubcategoryFor211Model[]> {
    var uri: string = encodeURI(this.oneClickUrl+'oneclick_refernet/sub_categories?category='+categoryName);

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(jsonable => JSON.parse(jsonable) as SubcategoryFor211Model[])
      .catch(this.handleError);
  }

  getSubSubcategoryForSubcategoryName(subcategoryName: string): Promise<SubSubcategoryFor211Model[]>{

    var uri: string = encodeURI(this.oneClickUrl+'oneclick_refernet/sub_sub_categories?sub_category='+subcategoryName);

    // console.log(uri);

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(jsonable => JSON.parse(jsonable) as SubSubcategoryFor211Model[])
      .catch(this.handleError);
  }

  // Gets refernet services based on subsubcategory name, and optional lat/lng
  getServicesFromSubSubCategoryName(subSubCategoryName: string, lat: number, lng: number): Promise<ServiceModel[]>{
    let uri: string = this.oneClickUrl;

    if(lat && lng) {
      uri = encodeURI(uri+'oneclick_refernet/services?sub_sub_category='+subSubCategoryName+'&lat='+lat+'&lng='+lng);
    } else {
      uri = encodeURI(uri+'oneclick_refernet/services?sub_sub_category='+subSubCategoryName);
    }

    console.log(uri);

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(jsonable => JSON.parse(jsonable) as ServiceModel[])
      .catch(this.handleError);
  }

  getTripPlan(tripRequest: TripRequestModel): Observable<TripResponseModel>
  {
    let headers = this.auth.authHeaders();
    let options = new RequestOptions({ headers: headers });

    return this.http
            .post(this.oneClickUrl+'trips/plan', tripRequest, options)
            .map( response => {
              return (response.json().data.trip as TripResponseModel)
            })
  }

  getAlerts(): Promise<Alert[]>{
    let headers = this.auth.authHeaders();
    let options = new RequestOptions({ headers: headers });

    return this.http
            .get(this.oneClickUrl+'alerts', options)
            .toPromise()
            .then(response => response.text())
            .then(json => JSON.parse(json).data.user_alerts as Alert[])
            .catch(this.handleError);
  }

  ackAlert(alert: Alert){

    if(alert.id == null){
      return
    }

    let headers = this.auth.authHeaders();
    let options = new RequestOptions({ headers: headers });

    let body = {
      "user_alert": {
        "acknowledged": true
      }
    };

    return this.http
            .put(this.oneClickUrl+'alerts/'+alert.id, body, options)
            .toPromise()
            .catch(this.handleError);
  }

  // Creates a feedback, including rating and review, for a service
  createFeedback(feedback: FeedbackModel): Promise<any> {
    let headers = this.auth.authHeaders();
    let options = new RequestOptions({ headers: headers });

    return this.http
            .post(this.oneClickUrl + 'feedbacks', { feedback: feedback}, options)
            .toPromise()
            .catch(this.handleError);
  }

  // Makes a refernet keyword search call, returning the results array
  refernetKeywordSearch(term: string): Observable<SearchResultModel[]> {
    var uri: string = encodeURI(this.oneClickUrl+'oneclick_refernet/search?term=' + term);

    return this.http.get(uri)
      .map( (response) => {
        return response.json().results as SearchResultModel[];
      });
  }

  // Console log the error and pass along a rejected promise... if uncaught
  // by the calling component, will still raise an error.
  private handleError(error: any): any {
    console.error('An error occurred', error.text()); // for demo purposes only
    return Promise.reject(error);
  }

}
