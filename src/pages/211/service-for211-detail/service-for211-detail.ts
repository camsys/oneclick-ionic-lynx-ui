import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { ServiceFor211ReviewPage } from '../service-for211-review/service-for211-review';
import { DirectionsPage } from '../../directions/directions';
import { TransportationEligibilityPage } from '../../transportation-eligibility/transportation-eligibility';
import { OneClickProvider } from '../../../providers/one-click/one-click';

import { ServiceModel } from '../../../models/service';
import { TripModel } from "../../../models/trip";
import { TripRequestModel } from "../../../models/trip-request";
import { TripResponseModel } from "../../../models/trip-response";
import { Session } from '../../../models/session';

//TODO REMOVE
import { OneClickPlaceModel } from "../../../models/one-click-place";
import { GooglePlaceModel } from "../../../models/google-place";
import { environment } from '../../../app/environment';


/**
 * Generated class for the ServiceFor211DetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-for211-detail',
  templateUrl: 'service-for211-detail.html',
})
export class ServiceFor211DetailPage {

  service: ServiceModel;
  origin: GooglePlaceModel;
  destination: GooglePlaceModel;
  basicModes:string[] = ['transit', 'car', 'taxi', 'uber'] // All available modes except paratransit
  tripRequest: TripRequestModel;
  tripResponse: TripResponseModel;
  
  transitTime: number = 0;
  driveTime: number = 0;

  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || null) as Session);
  }

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public oneClickProvider: OneClickProvider,
              public events: Events) {
  
    console.log("NAV PARAMS", navParams.data);
  
    // Set the service (if present)
    this.service = navParams.data.service;

    // Set origin and destination places
    this.origin = new GooglePlaceModel(navParams.data.origin);
    this.destination = new GooglePlaceModel(navParams.data.destination);
    
    // // Set origin and destination places
    // this.setOrigin();
    // this.setDestination();
    
    // Set transit and drive time
    if(this.service) {
      this.transitTime = this.service.transit_time;
      this.driveTime = this.service.drive_time;
    }
    
    // Plan a default trip and store the result
    this.oneClickProvider
    .getTripPlan(this.buildTripRequest(this.basicModes))
    .forEach((resp) => {
      this.tripResponse = new TripResponseModel(resp);
      this.updateTravelTimesFromTripResponse(this.tripResponse);
      console.log("TRIP RESPONSE RETURNED!", this.tripResponse);
    });
    
    console.log("NAVPARAMS", navParams.data, this.service, this.origin, this.destination);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceFor211DetailPage');
  }

  openServiceReviewPage(){
    this.navCtrl.push(ServiceFor211ReviewPage);
  }

  openDirectionsPage(mode: string){
    console.log("OPENING DIRECTIONS PAGE", this.tripResponse);
    let modalTripResponse = this.tripResponseWithFilteredItineraries(this.tripResponse, mode);
    
    this.navCtrl.push(DirectionsPage, {
      trip_response: modalTripResponse,
      mode: mode
    });
    
    // this.events.publish('spinner:show');
    // 
    // this.buildTripRequest([mode]);
    // 
    // let result = this.oneClickProvider.getTripPlan(this.tripRequest).
    //   forEach(value => { 
    //     this.events.publish('spinner:hide');
    //     this.navCtrl.push(DirectionsPage, {
    //       trip_response: value,
    //       mode: mode
    //     });
    //   });
  }

  openOtherTransportationOptions(){
    this.navCtrl.push(TransportationEligibilityPage)
  }
  
  // Origin defaults to user location if not passed in NavParams.
  // Or, if neither set, builds a default location
  setOrigin() {
    this.origin = new GooglePlaceModel(
      this.navParams.data.origin || 
      this.session().user_starting_location
    );
  }

  // If service is passed, set destination to service location.
  // otherwise, set to navParams or build a default location
  setDestination() {
    if(this.service && this.service.lat && this.service.lng) {
      this.destination = new GooglePlaceModel({
        name: this.service.site_name,
        geometry: {lat: this.service.lat, lng: this.service.lng}
      });
    } else {
      this.destination = new GooglePlaceModel(
        this.navParams.data.destination ||
        { geometry: environment.DEFAULT_LOCATION }
      );
    }
  }
  
  // Builds a trip request based on the passed mode, stored origin/destination,
  // and current time
  buildTripRequest(modes: string[]) {
    let tripRequest = this.tripRequest = new TripRequestModel();

    // Set origin and destination
    tripRequest.trip.origin_attributes = this.origin.toOneClickPlace();
    tripRequest.trip.destination_attributes = this.destination.toOneClickPlace();
    
    // Set trip time to now by default, in ISO 8601 format
    tripRequest.trip.trip_time = new Date().toISOString();
    
    // Set arrive_by to true by default
    tripRequest.trip.arrive_by = false;

    // Set trip types to the mode passed to this method
    tripRequest.trip_types = modes;
    
    return tripRequest;
  }
  
  // Updates transit and drive time based on a trip response
  updateTravelTimesFromTripResponse(tripResponse: TripResponseModel) {
    let transitItin = tripResponse.itinerariesByTripType('transit')[0];
    if(transitItin && transitItin.duration) {
      this.transitTime = transitItin.duration;      
    }
    
    let driveItin = tripResponse.itinerariesByTripType('car')[0];
    if(driveItin && driveItin.duration) {
      this.driveTime = driveItin.duration;
    }
  }
  
  // Returns a trip response object but with only the itineraries of the passed mode
  tripResponseWithFilteredItineraries(tripResponse: TripResponseModel, 
                                      mode: string) {
    let newTripResponse = new TripResponseModel(tripResponse);
    newTripResponse.itineraries = newTripResponse.itinerariesByTripType(mode);
    console.log("NEW TRIP RESPONSE", newTripResponse);
    return newTripResponse;
  }
  
  // Returns duration in seconds for the given mode
  durationFor(mode:string): number {
    switch(mode) {
      case 'transit':
        return this.transitTime;
      case 'car':
      case 'taxi':
      case 'uber':
      case 'paratransit':
        return this.driveTime;
      default:
        return this.driveTime;
    }
  }
  
  // Returns a label for the passed mode
  labelFor(mode:string): string {
    switch(mode) {
      case 'transit':
        return "Bus & Train";
      case 'car':
        return "Drive";
      case 'taxi':
        return "Taxi";
      case 'uber':
        return "Uber"
      case 'paratransit':
        return "Other Transportation Options"
      default:
        return "";
    }
  }

}
