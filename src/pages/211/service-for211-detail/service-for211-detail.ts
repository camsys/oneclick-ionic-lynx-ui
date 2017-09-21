import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { ServiceFor211ReviewPage } from '../service-for211-review/service-for211-review';
import { DirectionsPage } from '../../directions/directions';
import { TransportationEligibilityPage } from '../../transportation-eligibility/transportation-eligibility';
import { OneClickProvider } from '../../../providers/one-click/one-click';

import { ServiceModel } from '../../../models/service';
import { TripModel } from "../../../models/trip";
import { TripRequestModel } from "../../../models/trip-request";
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

  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || null) as Session);
  }

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public oneClickProvider: OneClickProvider,
              public events: Events) {
                
    this.service = navParams.data.service;
    
    // // Origin defaults to user location if not passed in NavParams.
    // // Or, if neither set, builds a default location
    this.origin = navParams.data.origin || 
                  this.session().user_starting_location;
    //               
    // // If service is passed, set destination to service location.
    // // otherwise, set to navParams or build a default location
    // if(this.service && this.service.lat && this.service.lng) {
    //   this.destination = new GooglePlaceModel({lat: this.service.lat, lng: this.service.lng});
    // } else {
    //   this.destination = navParams.data.destination ||
    //                      new GooglePlaceModel(environment.DEFAULT_LOCATION);
    // }
    
    console.log("NAVPARAMS", navParams.data, this.service, this.origin, this.destination);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceFor211DetailPage');
  }

  openServiceReviewPage(){
    this.navCtrl.push(ServiceFor211ReviewPage);
  }

  openDirectionsPage(mode: string){
    
    this.events.publish('spinner:show');

    let startLocation = this.origin;

    // Set default location if it's not stored in the session
    if(startLocation == null) {
      startLocation = new GooglePlaceModel();
      startLocation.geometry.lat = environment.DEFAULT_LOCATION.lat;
      startLocation.geometry.lng = environment.DEFAULT_LOCATION.lng;
    }

    let tripRequest = new TripRequestModel();

    // Set origin and destination
    tripRequest.trip.origin_attributes.lat = startLocation.geometry.lat;
    tripRequest.trip.origin_attributes.lng = startLocation.geometry.lng;
    tripRequest.trip.origin_attributes.name = startLocation.formatted_address;
    tripRequest.trip.destination_attributes.lat = this.service.lat;
    tripRequest.trip.destination_attributes.lng = this.service.lng;
    tripRequest.trip.destination_attributes.name = this.service.site_name;
    
    // Set trip time to now by default, in ISO 8601 format
    tripRequest.trip.trip_time = new Date().toISOString();
    
    // Set arrive_by to true by default
    tripRequest.trip.arrive_by = false;

    // Set trip types to the mode passed to this method
    tripRequest.trip_types = [mode];

    let result = this.oneClickProvider.getTripPlan(tripRequest).
      forEach(value => { 
        this.events.publish('spinner:hide');
        this.navCtrl.push(DirectionsPage, {
          trip_response: value,
          mode: mode
        });
      });
  }

  openOtherTransportationOptions(){
    this.navCtrl.push(TransportationEligibilityPage)
  }

}
