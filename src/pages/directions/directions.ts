import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DirectionsStepsTabPage } from '../directions-steps-tab/directions-steps-tab';
import { DirectionsMapTabPage } from '../directions-map-tab/directions-map-tab';

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
  mode: string;
  stepsTab: any;
  mapTab: any;
  directionsParams: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.trip = navParams.data.trip_response;
    this.mode = navParams.data.mode;
    this.stepsTab = DirectionsStepsTabPage;
    this.mapTab = DirectionsMapTabPage;
    this.directionsParams = {
      trip: this.trip,
      mode: this.mode
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DirectionsPage');
  }

}
