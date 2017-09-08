import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TripResponseModel } from "../../models/trip-response";
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
  trip:TripResponseModel;
  itineraries: ItineraryModel[];
  itinerary: ItineraryModel;
  steps: LegStepModel[];
  selectedItinerary: string;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log("DATA: ", navParams.data);
    this.steps = [];
    this.trip = navParams.data;
    this.itinerary = this.trip.itineraries[0];
    this.itineraries = this.trip.itineraries;
    this.selectedItinerary = "0";

    for (let leg of this.itinerary.legs){
      for(let step of leg.steps){
        this.steps.push(step)
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DirectionsOptionsPage');
    console.log(this.trip);
  }
  
  selectRouteOption(i: number) {
    console.log("SELECTING ROUTE OPTION", i);
  }
  
  indexToString(i: number): string {
    return i.toString();
  }

}
