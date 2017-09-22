import { Component, ViewChild } from '@angular/core';
import { App, IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { TripResponseModel } from "../../models/trip-response";
import { TripRequestModel } from "../../models/trip-request";
import { TripModel } from "../../models/trip";
import { ItineraryModel } from "../../models/itinerary";
import { LegModel } from "../../models/leg";
import { LegStepModel } from "../../models/leg-step";
import { OneClickProvider } from '../../providers/one-click/one-click';
import { DirectionsPage } from '../directions/directions';


/**
 * Generated class for the DirectionsOptionsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-directions-options',
  templateUrl: 'directions-options.html',
})
export class DirectionsOptionsPage {
  @ViewChild('arriveByDatepicker') arriveByDatepicker: any;
  trip:TripResponseModel;
  mode:string;
  itineraries: ItineraryModel[];
  selectedItinerary: string; // Index of selected itinerary within the itineraries array
  tripRequest:TripRequestModel;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public oneClickProvider: OneClickProvider,
              private _app: App,
              public events: Events) {
    this.trip = navParams.data.trip;
    this.mode = navParams.data.mode;
    
    // Instantiate actual Leg Model objects for each leg in the itinerary
    this.itineraries = this.trip.itineraries.map(function(itin) {
      itin.legs = itin.legs.map(function(legAttrs) {
        return new LegModel().assignAttributes(legAttrs);
      });
      return itin;
    });
    
    this.selectedItinerary = "0";
    this.tripRequest = new TripRequestModel;
    this.tripRequest.trip_types = [this.mode]
    this.tripRequest.trip = JSON.parse(JSON.stringify(this.trip)); // Copy the trip into the tripRequest
    this.tripRequest.trip.origin_attributes = { lat: this.trip.origin.lat, lng: this.trip.origin.lng, name: this.trip.origin.name }
    this.tripRequest.trip.destination_attributes = { lat: this.trip.destination.lat, lng: this.trip.destination.lng, name: this.trip.destination.name }
  }

  ionViewDidLoad() { }
  
  // When depart at time is updated, submit new trip plan request with arrive_by = false
  updateDepartAt() {
    this.tripRequest.trip.arrive_by = false;
    this.replanTrip();
  }
  
  // When depart at time is updated, submit new trip plan request with arrive_by = true
  updateArriveBy() {
    this.tripRequest.trip.arrive_by = true;
    this.replanTrip();
  }
  
  // Makes a new trip request and reloads the Directions page.
  replanTrip() {
    this.events.publish('spinner:show');
    
    let result = this.oneClickProvider.getTripPlan(this.tripRequest).
      forEach(value => {
        this.events.publish('spinner:hide');
        this._app.getRootNav()      // Load the new directions page on top of the parent page, not within the tab
        .push(DirectionsPage, {
          trip_response: value,
          mode: this.mode
        });
      });
  }

}
