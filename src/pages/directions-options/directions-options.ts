import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TripResponseModel } from "../../models/trip-response";
import { TripRequestModel } from "../../models/trip-request";
import { TripModel } from "../../models/trip";
import { ItineraryModel } from "../../models/Itinerary";
import { LegModel } from "../../models/leg";
import { LegStepModel } from "../../models/leg-step";

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
  itineraries: ItineraryModel[];
  selectedItinerary: string; // Index of selected itinerary within the itineraries array
  tripRequest:TripRequestModel;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
    this.trip = navParams.data;
    
    // Instantiate actual Leg Model objects for each leg in the itinerary
    this.itineraries = this.trip.itineraries.map(function(itin) {
      itin.legs = itin.legs.map(function(legAttrs) {
        return new LegModel().assignAttributes(legAttrs);
      });
      return itin;
    });
    
    this.selectedItinerary = "0";
    this.tripRequest = new TripRequestModel;
    this.tripRequest.trip = new TripModel;
    this.tripRequest.trip.trip_time = this.trip.trip_time;
    this.tripRequest.trip.arrive_by = this.trip.arrive_by;
  }

  ionViewDidLoad() { }
  
  updateDepartAt() {
    console.log("DEPART AT UPDATED", this.tripRequest);
  }

}
