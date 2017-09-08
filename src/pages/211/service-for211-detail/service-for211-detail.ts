import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ServiceFor211ReviewPage } from '../service-for211-review/service-for211-review';
import { DirectionsPage } from '../../directions/directions';
import { TransportationEligibilityPage } from '../../transportation-eligibility/transportation-eligibility';
import { OneClickProvider } from '../../../providers/one-click/one-click';

import { ServiceModel } from '../../../models/service';
import { TripModel } from "../../../models/trip";
import { TripRequestModel } from "../../../models/trip-request";
import { Session } from '../../../models/session';

//TODO REMOVE
import { PlaceModel } from '../../../models/place';
import { environment } from '../../../app/environment';


/**
 * Generated class for the ServiceFor211DetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-for211-detail',
  templateUrl: 'service-for211-detail.html',
})
export class ServiceFor211DetailPage {

  service: ServiceModel;

  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || null) as Session);
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public oneClickProvider: OneClickProvider) {
    this.service = navParams.data.service;
    console.log(navParams.data.service);

    console.log(navParams);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceFor211DetailPage');
  }

  openServiceReviewPage(){
    this.navCtrl.push(ServiceFor211ReviewPage);
  }

  openDirectionsPage(mode: string){

    let startLocation = this.session().user_starting_location;

    // Set default location if it's not stored in the session
    if(startLocation == null) {
      startLocation = new PlaceModel();
      startLocation.geometry.lat = environment.DEFAULT_LOCATION.lat;
      startLocation.geometry.lng = environment.DEFAULT_LOCATION.lng;
    }

    let tripRequest = new TripRequestModel();
    // tripPlan.origin_attributes = new LocationModel;
    // tripPlan.destination_attributes = new LocationModel;

    tripRequest.trip.origin_attributes.lat = startLocation.geometry.lat;
    tripRequest.trip.origin_attributes.lng = startLocation.geometry.lng;

    tripRequest.trip.destination_attributes.lat = this.service.lat;
    tripRequest.trip.destination_attributes.lng = this.service.lng;

    tripRequest.trip_types = [mode];

    console.log(tripRequest);

    let result = this.oneClickProvider.getTripPlan(tripRequest).
      forEach(value => { 
        this.navCtrl.push(DirectionsPage, {
          trip_response: value,
          mode: mode
        });
      });
  }

  openOtherTransportationOptions(){
    this.navCtrl.push(TransportationEligibilityPage)
  }

}
