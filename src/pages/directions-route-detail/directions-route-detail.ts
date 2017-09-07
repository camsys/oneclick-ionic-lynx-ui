import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TripResponseModel } from "../../models/trip-response";

/**
 * Generated class for the DirectionsRouteDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-directions-route-detail',
  templateUrl: 'directions-route-detail.html',
})
export class DirectionsRouteDetailPage {
  trip:TripResponseModel;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.trip = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DirectionsRouteDetailPage');
    console.log(this.trip);
  }

}
