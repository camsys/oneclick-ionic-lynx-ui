import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TripResponseModel } from '../../models/trip-response';
import { OneClickServiceModel } from '../../models/one-click-service';


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
  taxiServices: OneClickServiceModel[];
  mode: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.trip = navParams.data.trip_response;
    this.mode = navParams.data.mode;
    this.taxiServices = this.trip.itineraries.map((itin) => {
      let svc = new OneClickServiceModel(itin.service);
      svc.fare = itin.cost;
      return svc;
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaxiTransportationPage');
  }

}
