import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DirectionsOptionsPage } from '../directions-options/directions-options';
import { DirectionsRouteDetailPage } from '../directions-route-detail/directions-route-detail';

import { TripResponseModel } from "../../models/trip-response";

/**
 * Generated class for the DirectionsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-directions',
  templateUrl: 'directions.html',
})
export class DirectionsPage {

  trip: TripResponseModel;
  routeOptions: any;
  mapTab: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.trip = navParams.data.trip_response;
    this.routeOptions = DirectionsOptionsPage;
    this.mapTab = DirectionsRouteDetailPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DirectionsPage');
  }

}
