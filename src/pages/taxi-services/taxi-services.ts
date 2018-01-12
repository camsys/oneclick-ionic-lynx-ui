import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TripResponseModel } from '../../models/trip-response';
import { OneClickServiceModel } from '../../models/one-click-service';

import { OneClickProvider } from '../../providers/one-click/one-click';

import { HelpMeFindPage } from '../help-me-find/help-me-find';

/**
 * Generated class for the TaxiServicesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-taxi-services',
  templateUrl: 'taxi-services.html',
})
export class TaxiServicesPage {
  trip: TripResponseModel;
  taxiServices: OneClickServiceModel[];

  trip_id: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public oneClick: OneClickProvider) {

    this.trip_id = parseInt(navParams.data.trip_id);

  }

  // Loads the page with trip response data
  loadTrip(trip: TripResponseModel) {
    this.trip = new TripResponseModel(trip).withFilteredItineraries('taxi');
    this.taxiServices = this.trip.itineraries.map((itin) => {
      let svc = new OneClickServiceModel(itin.service);
      svc.fare = itin.cost;
      return svc;
    })
  }

  ionViewDidLoad() {

    if(this.navParams.data.trip_response) {
      this.loadTrip(this.navParams.data.trip_response);
    } else if (this.trip_id) {
      this.oneClick.getTrip(this.trip_id)
      .subscribe((tripResp) => this.loadTrip(tripResp));
    } else {
      this.navCtrl.setRoot(HelpMeFindPage); // If necessary navParams aren't present, go back to the home page
    }
  }

}
