import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TripResponseModel } from '../../models/trip-response';
import { ItineraryModel } from '../../models/itinerary';

/**
 * Generated class for the TaxiTransportationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-taxi-transportation',
  templateUrl: 'taxi-transportation.html',
})
export class TaxiTransportationPage {
  trip: TripResponseModel;
  itineraries: ItineraryModel[];
  mode: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.trip = navParams.data.trip_response;
    this.mode = navParams.data.mode;
    this.itineraries = this.trip.itineraries
    console.log(this.trip);
    console.log(this.itineraries);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaxiTransportationPage');
  }

}
