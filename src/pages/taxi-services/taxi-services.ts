import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TripResponseModel } from '../../models/trip-response';
import { OneClickServiceModel } from '../../models/one-click-service';

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
  mode: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
                
    if(navParams.data.trip_response && navParams.data.mode) {
      this.trip = navParams.data.trip_response;
      this.mode = navParams.data.mode;
      this.taxiServices = this.trip.itineraries.map((itin) => {
        let svc = new OneClickServiceModel(itin.service);
        svc.fare = itin.cost;
        return svc;
      })
    } else {
      this.navCtrl.setRoot(HelpMeFindPage); // If necessary navParams aren't present, go back to the home page
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaxiServicesPage');
  }

}
