import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { RequestOptions } from '@angular/http';

// import { Events } from 'ionic-angular';

import { Observable } from "rxjs/Rx";
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
import { I18nProvider } from '../../providers/i18n/i18n';

// OneClick Provider handles API Calls to the OneClick Core back-end.
@Injectable()
export class OneClickProvider {

  public oneClickUrl = environment.BASE_ONECLICK_URL;

  constructor(public http: Http,
              private auth: AuthProvider,
              private i18n: I18nProvider) {}
              
  // Constructs a request options hash with auth headers
  requestOptions(): RequestOptions {
    return new RequestOptions({ headers: this.auth.authHeaders() });
  }

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

  // Gets OneClick global landmarks and user's stomping grounds based on a query string
  public getPlaces(places_query: String ): Observable<GooglePlaceModel[]> {
    return this.http
     .get(this.oneClickUrl + "places?name=" + places_query + "&max_results=10", this.requestOptions())
     .map( (response) => {
       return response.json().data.places as GooglePlaceModel[];
     })
  }
  
  // Gets users stomping grounds
  public getStompingGrounds(): Observable<GooglePlaceModel[]> {
    return this.http
      .get(this.oneClickUrl + "stomping_grounds", this.requestOptions())
      .map( (response) => {
        return response.json().data.stomping_grounds as GooglePlaceModel[];
      })
  }

  public getAgencies(type: String): Promise<AgencyModel[]> {
    let uri: string = encodeURI(this.oneClickUrl + 
      'agencies?type=' + type +
      '&locale=' + this.i18n.currentLocale()
    );

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(json => JSON.parse(json).data.agencies as AgencyModel[])
      .catch(this.handleError);
  }

  // Gets all paratransit services from OneClick
  public getParatransitServices(): Promise<OneClickServiceModel[]> {
    let uri: string = encodeURI(this.oneClickUrl + 
      'services?type=paratransit' +
      '&locale=' + this.i18n.currentLocale()
    );

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(json => JSON.parse(json).data.services as OneClickServiceModel[])
      .catch(this.handleError);
  }

  // Gets a User from 1-Click
  getProfile(): Promise<User>{
     var uri: string = encodeURI(this.oneClickUrl + 'users');
     return this.http.get(uri, this.requestOptions())
      .toPromise()
      .then((response) => this.unpackUserResponse(response))
      .catch(this.handleError);
  }

  // Updates a User in 1-Click
  updateProfile(user: User): Promise<User>{
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
    
    let attributes = {
      "first_name": user.first_name,
      "last_name": user.last_name,
      "email": user.email,
      "preferred_locale": user.preferred_locale
    }
    
    if(user.password && user.password_confirmation) {
      attributes["password"] = user.password;
      attributes["password_confirmation"] = user.password_confirmation;
    }

    let body = {
      "attributes": attributes,
      "accommodations": formatted_accs,
      "eligibilities": formatted_eligs,
      "trip_types": formatted_trip_types
    };

    var uri: string = encodeURI(this.oneClickUrl + 'users');
    return this.http.put(uri, body, this.requestOptions())
      .toPromise()
      .then((response) => this.unpackUserResponse(response))
      .catch(this.handleError);
  }
  
  // Unpacks a OneClick user response and stores the user in the session
  unpackUserResponse(response): User {
    let user = JSON.parse(response.text()).data.user as User;
    return this.auth.updateSessionUser(user); // store user info in session storage
  }

  getCategoriesFor211Services(lat: number, lng: number): Promise<CategoryFor211Model[]> {
    let uri: string = encodeURI(
      this.oneClickUrl + 
      'oneclick_refernet/categories?locale=' + 
      this.i18n.currentLocale()
    );
    
    // Add lat & lng params
    if(lat && lng) { uri += ('&lat=' + lat + '&lng=' + lng); }

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(jsonable => JSON.parse(jsonable) as CategoryFor211Model[])
      .then(categories => this.filterEmptyCategories(categories))
      .catch(this.handleError);
  }

  getSubcategoryForCategoryName(categoryName: string, lat: number, lng: number): Promise<SubcategoryFor211Model[]> {
    let uri: string = encodeURI(
      this.oneClickUrl + 
      'oneclick_refernet/sub_categories?category=' + 
      categoryName +
      '&locale=' +
      this.i18n.currentLocale()
    );
    
    // Add lat & lng params
    if(lat && lng) { uri += ('&lat=' + lat + '&lng=' + lng); }

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(jsonable => JSON.parse(jsonable) as SubcategoryFor211Model[])
      .then(subCats => this.filterEmptyCategories(subCats))
      .catch(this.handleError);
  }

  getSubSubcategoryForSubcategoryName(subcategoryName: string, lat: number, lng: number): Promise<SubSubcategoryFor211Model[]>{

    let uri: string = encodeURI(
      this.oneClickUrl +
      'oneclick_refernet/sub_sub_categories?sub_category=' +
      subcategoryName + 
      '&locale=' + 
      this.i18n.currentLocale()
    );
    
    // Add lat & lng params
    if(lat && lng) { uri += ('&lat=' + lat + '&lng=' + lng); }

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(jsonable => JSON.parse(jsonable) as SubSubcategoryFor211Model[])
      .then(subSubCats => this.filterEmptyCategories(subSubCats))
      .catch(this.handleError);
  }

  // Gets refernet services based on subsubcategory name, and optional lat/lng
  getServicesFromSubSubCategoryName(subSubCategoryName: string, lat: number, lng: number): Promise<ServiceModel[]>{
    var uri: string = encodeURI(
      this.oneClickUrl +
      'oneclick_refernet/services?sub_sub_category=' +
      subSubCategoryName + 
      '&locale=' + 
      this.i18n.currentLocale()
    );
    
    // Add lat & lng params
    if(lat && lng) { uri += ('&lat=' + lat + '&lng=' + lng); }

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(jsonable => JSON.parse(jsonable) as ServiceModel[])
      .catch(this.handleError);
  }

  getTripPlan(tripRequest: TripRequestModel): Observable<TripResponseModel>
  {
    let uri = encodeURI(this.oneClickUrl + 
                        'trips/plan?locale=' +
                        this.i18n.currentLocale())

    return this.http
            .post(uri, tripRequest, this.requestOptions())
            .map( response => {
              let trip = (response.json().data.trip as TripResponseModel);
              let user = trip.user as User;
              // If no user is signed in, OR the user is signed in as the user
              // returned by the trip plan call, store returned user info in the session.
              if(!this.auth.isSignedIn() || this.auth.isSignedIn(user)) {
                this.auth.updateSessionUser(user);
              }
              
              return trip;
            })
  }

  getAlerts(): Promise<Alert[]>{
    let uri = encodeURI(this.oneClickUrl + 
                        'alerts?locale=' +
                        this.i18n.currentLocale())

    return this.http
               .get(uri, this.requestOptions())
               .toPromise()
               .then(response => response.text())
               .then(json => JSON.parse(json).data.user_alerts as Alert[])
               .catch(this.handleError);
  }

  ackAlert(alert: Alert){

    if(alert.id == null){
      return
    }

    let body = {
      "user_alert": {
        "acknowledged": true
      }
    };

    return this.http
               .put(this.oneClickUrl+'alerts/'+alert.id, body, this.requestOptions())
               .toPromise()
               .catch(this.handleError);
  }

  // Creates a feedback, including rating and review, for a service
  createFeedback(feedback: FeedbackModel): Promise<any> {

    return this.http
               .post(this.oneClickUrl + 'feedbacks', { feedback: feedback}, this.requestOptions())
               .toPromise()
               .catch(this.handleError);
  }

  // Makes a refernet keyword search call, returning the results array
  refernetKeywordSearch(term: string, typeFilter: string = ""): Observable<SearchResultModel[]> {
    var uri: string = encodeURI(
      this.oneClickUrl + 
      'oneclick_refernet/search?term=' + term +
      '&locale=' + this.i18n.currentLocale() +
      '&type=' + typeFilter);

    return this.http.get(uri)
      .map( (response) => {
        return response.json().results as SearchResultModel[];
      });
  }

  // Email 211 Services
  email211Service(email: string, id: number[]): Promise<any> {
    return this.http
            .post(this.oneClickUrl + 'oneclick_refernet/email', 
                  { email:  email, "services": id, locale: this.i18n.currentLocale()}, 
                  this.requestOptions())
            .toPromise()
            .catch(this.handleError);
  }

  // Console log the error and pass along a rejected promise... if uncaught
  // by the calling component, will still raise an error.
  private handleError(error: any): any {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error);
  }
  
  // Filters out any categories without associated services
  private filterEmptyCategories(categories: any[]): any[] {
    return categories.filter(cat => cat.service_count > 0);
  }

}
